/**
 * Run this script once to create the admin user:
 *   node backend/scripts/createAdmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rentease');
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@rentease.com' });
    if (existing) {
      console.log('Admin user already exists. Email: admin@rentease.com');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'Admin',
      email: 'admin@rentease.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created!');
    console.log('   Email:    admin@rentease.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Change the password after first login.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
