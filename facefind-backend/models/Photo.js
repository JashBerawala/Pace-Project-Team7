const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  eventId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url:        { type: String, required: true },
  filename:   { type: String, required: true },
  faces:      { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
