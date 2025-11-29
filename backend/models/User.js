const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for teacher added by admin
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
