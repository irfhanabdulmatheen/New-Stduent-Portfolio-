const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Always target the specific admin email
        let admin = await User.findOne({ email: 'admin@portfolio.com' });

        if (admin) {
            console.log('Admin already exists. Resetting password and role...');
            admin.password = 'admin123';
            admin.role = 'admin';
            admin.isActive = true;
            await admin.save();
            console.log('Admin account updated/reset successfully!');
        } else {
            console.log('Creating new admin account...');
            admin = new User({
                name: 'Admin',
                email: 'admin@portfolio.com',
                password: 'admin123',
                role: 'admin',
                isActive: true
            });
            await admin.save();
            console.log('Admin created successfully!');
        }

        console.log('-----------------------------------');
        console.log('EMAIL: admin@portfolio.com');
        console.log('PASSWORD: admin123');
        console.log('ROLE: admin');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
