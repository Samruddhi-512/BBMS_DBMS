const express = require('express');
const router = express.Router();
const Building = require('../models/Building');
const Business = require('../models/Business');
const Employee = require('../models/Employee');
const Owner = require('../models/Owner');

// Cross-collection simple search demo
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json({ buildings: [], businesses: [], employees: [], owners: [] });
    }
    
    // Case-insensitive regex search
    const regex = new RegExp(query, 'i');
    
    const buildings = await Building.find({ 
      $or: [{ name: regex }, { address: regex }] 
    });
    
    const businesses = await Business.find({ 
      $or: [{ name: regex }, { type: regex }] 
    }).populate('owner', 'name');
    
    const employees = await Employee.find({ 
      $or: [{ name: regex }, { role: regex }] 
    }).populate('business', 'name');

    const owners = await Owner.find({
      $or: [{ name: regex }, { email: regex }]
    });
    
    res.json({ buildings, businesses, employees, owners });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
