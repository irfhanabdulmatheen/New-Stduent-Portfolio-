const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-portfolio');
    const user = await User.findOne({ email: 'admin@example.com' });
    if (user) {
      console.log(`User found: ${user.email}, Role: ${user.role}`);
    } else {
      console.log('User NOT found: admin@example.com');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAdmin();
