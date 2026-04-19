require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const buildingRoutes = require('./routes/buildings');
const floorRoutes = require('./routes/floors');
const roomRoutes = require('./routes/rooms');
const ownerRoutes = require('./routes/owners');
const businessRoutes = require('./routes/businesses');
const employeeRoutes = require('./routes/employees');
const searchRoutes = require('./routes/search');

app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/search', searchRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
});
