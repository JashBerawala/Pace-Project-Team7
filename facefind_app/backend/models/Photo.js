const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  filename: { type: String, required: true },
  originalName: { type: String },
  path: { type: String, required: true },
  url: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'processed', 'failed'], 
    default: 'pending' 
  },
  faceEmbeddings: [{ type: [Number] }], // array of face embedding vectors
  faceCount: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now },
  processedAt: { type: Date }
});

module.exports = mongoose.model('Photo', photoSchema);
