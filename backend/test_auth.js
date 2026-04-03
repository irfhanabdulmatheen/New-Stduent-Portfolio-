const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const testLogin = async (email, password) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected. Looking for: ${email}`);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return;
        }
        console.log(`User found: ${user.email}, role: ${user.role}`);
        console.log('Validating password...');
        const isMatch = await user.comparePassword(password);
        console.log(`Match result: ${isMatch}`);
        if (isMatch) {
            console.log('SUCCESS: Credentials are valid');
        } else {
            console.log('FAILURE: Invalid credentials');
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
};

const args = process.argv.slice(2);
testLogin(args[0] || 'admin@example.com', args[1] || 'password123');
