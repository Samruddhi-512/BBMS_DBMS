const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String, // Keeping it simple for demo (plain-text or lightly handled later)
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'chairman', 'user'],
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
