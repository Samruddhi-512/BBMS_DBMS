const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Basic Login Demo (NO JWT for simplicity)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In a real app, send back a JWT. Here we just send success to demo login flow.
    res.json({ message: 'Login successful', role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
