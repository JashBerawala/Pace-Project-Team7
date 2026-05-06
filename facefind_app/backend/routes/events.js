const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const Event = require('../models/Event');
const Photo = require('../models/Photo');
const path = require('path');
const fs = require('fs');

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single event by code (for guests)
router.get('/code/:code', async (req, res) => {
  try {
    const event = await Event.findOne({ eventCode: req.params.code, isActive: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const eventCode = uuidv4().split('-')[0].toUpperCase();

    const event = new Event({ name, description, date, location, eventCode });
    await event.save();

    // Generate QR Code pointing to guest page
    const guestUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/guest/${eventCode}`;
    const qrDir = path.join(__dirname, '../uploads/qr');
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });
    
    const qrPath = path.join(qrDir, `${eventCode}.png`);
    await QRCode.toFile(qrPath, guestUrl, { width: 400, margin: 2 });
    
    event.qrCodeUrl = `/uploads/qr/${eventCode}.png`;
    await event.save();

    res.status(201).json({ success: true, event, guestUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    await Photo.deleteMany({ eventId: req.params.id });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH toggle event active
router.patch('/:id/toggle', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    event.isActive = !event.isActive;
    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
