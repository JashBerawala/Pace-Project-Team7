const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const Photo = require('../models/Photo');
const Event = require('../models/Event');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, `../uploads/events/${req.params.eventId}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// GET photos for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const photos = await Photo.find({ eventId: req.params.eventId }).sort({ uploadedAt: -1 });
    res.json({ success: true, photos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST upload photos (admin - batch)
router.post('/upload/:eventId', upload.array('photos', 50), async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const io = req.app.get('io');
    const savedPhotos = [];

    for (const file of req.files) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const url = `${baseUrl}/uploads/events/${req.params.eventId}/${file.filename}`;
      
      const photo = new Photo({
        eventId: req.params.eventId,
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        url,
        status: 'pending'
      });
      await photo.save();
      savedPhotos.push(photo);
    }

    // Update event photo count
    event.photoCount += req.files.length;
    await event.save();

    // Emit to admin room
    io.to(`event-${req.params.eventId}`).emit('photos-uploaded', {
      count: req.files.length,
      photos: savedPhotos
    });

    // Trigger ML processing in background
    processPhotosInBackground(savedPhotos, req.params.eventId, io);

    res.json({ success: true, message: `${req.files.length} photos uploaded`, photos: savedPhotos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a single photo
router.delete('/:photoId', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });

    // Delete file from disk
    if (fs.existsSync(photo.path)) {
      fs.unlinkSync(photo.path);
    }

    await Photo.findByIdAndDelete(req.params.photoId);

    // Update event photo count
    await Event.findByIdAndUpdate(photo.eventId, { $inc: { photoCount: -1 } });

    const io = req.app.get('io');
    io.to(`event-${photo.eventId}`).emit('photo-deleted', { photoId: req.params.photoId });

    res.json({ success: true, message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Background ML processing
async function processPhotosInBackground(photos, eventId, io) {
  const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
  
  for (const photo of photos) {
    try {
      // Update status to processing
      await Photo.findByIdAndUpdate(photo._id, { status: 'processing' });
      io.to(`event-${eventId}`).emit('photo-processing', { photoId: photo._id });

      // Call ML service
      const formData = new FormData();
      formData.append('file', fs.createReadStream(photo.path));
      formData.append('photo_id', photo._id.toString());

      const response = await axios.post(`${ML_URL}/process-photo`, formData, {
        headers: formData.getHeaders(),
        timeout: 30000
      });

      const { embeddings, face_count } = response.data;

      // Save embeddings
      await Photo.findByIdAndUpdate(photo._id, {
        status: 'processed',
        faceEmbeddings: embeddings,
        faceCount: face_count,
        processedAt: new Date()
      });

      // Update event processed count
      await Event.findByIdAndUpdate(eventId, { $inc: { processedCount: 1 } });

      io.to(`event-${eventId}`).emit('photo-processed', {
        photoId: photo._id,
        faceCount: face_count
      });
    } catch (err) {
      console.error(`Failed to process photo ${photo._id}:`, err.message);
      await Photo.findByIdAndUpdate(photo._id, { status: 'failed' });
      io.to(`event-${eventId}`).emit('photo-failed', { photoId: photo._id });
    }
  }
}

module.exports = router;
