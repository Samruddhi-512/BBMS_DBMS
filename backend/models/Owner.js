const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  email: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Owner', ownerSchema);
