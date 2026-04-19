const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  floorNumber: {
    type: Number,
    required: true
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Floor', floorSchema);
