const mongoose = require('mongoose');
require('dotenv').config();

const ensureAdmin = require('./ensureAdmin');

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        process.env.ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
        process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
        process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

        await ensureAdmin();

        console.log('-----------------------------------');
        console.log(`EMAIL: ${process.env.ADMIN_EMAIL}`);
        console.log(`PASSWORD: ${process.env.ADMIN_PASSWORD}`);
        console.log('ROLE: admin');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
