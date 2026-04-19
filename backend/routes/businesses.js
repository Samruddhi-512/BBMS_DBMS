const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

router.get('/', async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate('room', 'roomNumber')
      .populate('owner', 'name email');
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newBusiness = new Business(req.body);
    await newBusiness.save();
    res.status(201).json(newBusiness);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single business
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate('room').populate('owner');
    if (!business) return res.status(404).json({ message: 'Not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update business
router.put('/:id', async (req, res) => {
  try {
    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete business
router.delete('/:id', async (req, res) => {
  try {
    await Business.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
