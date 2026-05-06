const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const Photo = require('../models/Photo');
const Event = require('../models/Event');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/selfies');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `selfie-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// POST - guest uploads selfie to find their photos
router.post('/:eventCode', upload.single('selfie'), async (req, res) => {
  try {
    const event = await Event.findOne({ eventCode: req.params.eventCode, isActive: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found or inactive' });

    if (!req.file) return res.status(400).json({ success: false, message: 'Selfie required' });

    const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    // Get selfie embedding from ML service
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    let selfieEmbedding;
    try {
      const response = await axios.post(`${ML_URL}/get-embedding`, formData, {
        headers: formData.getHeaders(),
        timeout: 15000
      });
      selfieEmbedding = response.data.embedding;
    } catch (mlErr) {
      // Clean up selfie
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'Could not detect a face in your selfie. Please try again with a clearer photo.' 
      });
    }

    // Get all processed photos for this event
    const photos = await Photo.find({ 
      eventId: event._id, 
      status: 'processed',
      faceCount: { $gt: 0 }
    });

    if (photos.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.json({ 
        success: true, 
        message: 'No processed photos available yet. Check back soon!',
        matches: [] 
      });
    }

    // Send all embeddings to ML service for batch matching
    const embeddingsPayload = photos.map(p => ({
      photo_id: p._id.toString(),
      embeddings: p.faceEmbeddings
    }));

    const matchResponse = await axios.post(`${ML_URL}/match-faces`, {
      selfie_embedding: selfieEmbedding,
      photo_embeddings: embeddingsPayload,
      threshold: 0.45
    }, { timeout: 30000 });

    const matchedIds = matchResponse.data.matched_photo_ids;

    // Get full photo objects for matched IDs
    const matchedPhotos = photos
      .filter(p => matchedIds.includes(p._id.toString()))
      .map(p => ({ _id: p._id, url: p.url, uploadedAt: p.uploadedAt }));

    // Clean up selfie
    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      message: matchedPhotos.length > 0 
        ? `Found ${matchedPhotos.length} photo(s) with you!` 
        : 'No photos found with your face. More photos may be added soon.',
      matches: matchedPhotos,
      totalSearched: photos.length
    });
  } catch (err) {
    console.error('Match error:', err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: 'Matching failed. Please try again.' });
  }
});

module.exports = router;
