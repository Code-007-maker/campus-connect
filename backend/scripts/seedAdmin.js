require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const SALT_ROUNDS = 10;

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@campus.local';
  const adminPass = process.env.ADMIN_PASS || 'Admin@12345';
  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    console.log('Admin already exists:', adminEmail);
    process.exit(0);
  }
  const hashed = await bcrypt.hash(adminPass, SALT_ROUNDS);
  const admin = new User({
    name: 'Super Admin',
    email: adminEmail.toLowerCase(),
    password: hashed,
    role: 'admin'
  });
  await admin.save();
  console.log('Admin seeded:', adminEmail, 'password:', adminPass);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
