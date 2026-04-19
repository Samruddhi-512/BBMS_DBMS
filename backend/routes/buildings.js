const express = require('express');
const router = express.Router();
const Building = require('../models/Building');

// Get all buildings
router.get('/', async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create building
router.post('/', async (req, res) => {
  try {
    const newBuilding = new Building(req.body);
    await newBuilding.save();
    res.status(201).json(newBuilding);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single building
router.get('/:id', async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) return res.status(404).json({ message: 'Not found' });
    res.json(building);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update building
router.put('/:id', async (req, res) => {
  try {
    const updated = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete building
router.delete('/:id', async (req, res) => {
  try {
    await Building.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
