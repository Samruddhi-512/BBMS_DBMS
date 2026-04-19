const express = require('express');
const router = express.Router();
const Owner = require('../models/Owner');

router.get('/', async (req, res) => {
  try {
    const owners = await Owner.find();
    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newOwner = new Owner(req.body);
    await newOwner.save();
    res.status(201).json(newOwner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single owner
router.get('/:id', async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ message: 'Not found' });
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update owner
router.put('/:id', async (req, res) => {
  try {
    const updated = await Owner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete owner
router.delete('/:id', async (req, res) => {
  try {
    await Owner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
