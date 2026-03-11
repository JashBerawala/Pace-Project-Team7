const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Photo = require('../models/Photo');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get photos for an event
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const photos = await Photo.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload photo
router.post('/upload', auth, upload.single('photo'), async (req, res) => {
  try {
    const { eventId } = req.body;
    const photo = await Photo.create({
      eventId,
      uploadedBy: req.user.id,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    });

    // Notify via socket
    const io = req.app.get('io');
    io.to(`event-${eventId}`).emit('new-photo', photo);

    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete photo
router.delete('/:id', auth, async (req, res) => {
  try {
    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
