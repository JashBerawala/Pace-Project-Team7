const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  eventCode: { type: String, unique: true, required: true },
  qrCodeUrl: { type: String },
  isActive: { type: Boolean, default: true },
  photoCount: { type: Number, default: 0 },
  processedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
