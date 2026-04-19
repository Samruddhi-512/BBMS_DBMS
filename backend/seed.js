require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Building = require('./models/Building');
const Floor = require('./models/Floor');
const Room = require('./models/Room');
const Owner = require('./models/Owner');
const Business = require('./models/Business');
const Employee = require('./models/Employee');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear all existing data
    await Promise.all([
      User.deleteMany({}),
      Building.deleteMany({}),
      Floor.deleteMany({}),
      Room.deleteMany({}),
      Owner.deleteMany({}),
      Business.deleteMany({}),
      Employee.deleteMany({})
    ]);

    console.log('🧹 Cleared existing data.');

    // Users
    await User.create({ username: 'admin', password: 'password123', role: 'admin' });

    // Building
    const b1 = await Building.create({ name: 'Tech Park A', address: '101 Cyber City' });

    // Floor
    const f1 = await Floor.create({ floorNumber: 1, building: b1._id });

    // Room
    const r1 = await Room.create({ roomNumber: '101A', sizeSqFt: 1500, floor: f1._id });
    const r2 = await Room.create({ roomNumber: '102A', sizeSqFt: 1000, floor: f1._id });

    // Owner
    const o1 = await Owner.create({ name: 'Alice Smith', email: 'alice@example.com', phone: '555-0101' });

    // Business
    const biz1 = await Business.create({ name: 'Alpha Tech', type: 'IT Consulting', room: r1._id, owner: o1._id });

    // Employees
    await Employee.create({ name: 'John Doe', role: 'Manager', salary: 80000, business: biz1._id });
    await Employee.create({ name: 'Jane Roe', role: 'Developer', salary: 70000, business: biz1._id });

    console.log('🌱 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
