const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const Business = require('../models/Business');

// Get all floors with building info
router.get('/', async (req, res) => {
  try {
    const floors = await Floor.find().populate('building', 'name');
    res.json(floors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create floor
router.post('/', async (req, res) => {
  try {
    const newFloor = new Floor(req.body);
    await newFloor.save();
    res.status(201).json(newFloor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Extended Aggregation Pipeline Demo: Floor Summary
router.get('/:id/summary', async (req, res) => {
  try {
    const floorId = req.params.id;
    // Aggregation pipeline to get all rooms in a floor, businesses in those rooms, and count employees
    const summary = await Room.aggregate([
      { $match: { floor: new mongoose.Types.ObjectId(floorId) } },
      {
        $lookup: {
          from: 'businesses',
          localField: '_id',
          foreignField: 'room',
          as: 'business'
        }
      },
      { $unwind: { path: '$business', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'owners',
          localField: 'business.owner',
          foreignField: '_id',
          as: 'owner'
        }
      },
      { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'employees',
          localField: 'business._id',
          foreignField: 'business',
          as: 'employees'
        }
      },
      {
        $project: {
          _id: 0,
          roomNumber: 1,
          businessName: { $ifNull: ['$business.name', 'Vacant/N/A'] },
          ownerName: { $ifNull: ['$owner.name', 'N/A'] },
          employeeCount: { $size: '$employees' }
        }
      }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single floor
router.get('/:id', async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id).populate('building');
    if (!floor) return res.status(404).json({ message: 'Not found' });
    res.json(floor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update floor
router.put('/:id', async (req, res) => {
  try {
    const updated = await Floor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete floor
router.delete('/:id', async (req, res) => {
  try {
    await Floor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
