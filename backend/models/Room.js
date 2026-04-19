const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  sizeSqFt: {
    type: Number
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
