const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const recreateUsers = async () => {
    try {
        console.log('Connecting to:', uri);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB!');

        const users = [
            { name: 'Admin', email: 'admin@example.com', password: 'password123', role: 'admin' },
            { name: 'Teacher', email: 'teacher@example.com', password: 'password123', role: 'teacher' },
            { name: 'Student', email: 'student@example.com', password: 'password123', role: 'student' }
        ];

        for (let userData of users) {
            const existing = await User.findOne({ email: userData.email });
            if (existing) {
                await User.deleteOne({ _id: existing._id });
                await Profile.deleteOne({ userId: existing._id });
                console.log(`Reset: ${userData.email}`);
            }

            const user = new User(userData);
            await user.save();
            console.log(`Created: ${user.email} (${user.role})`);

            if (user.role === 'student' || user.role === 'teacher') {
                await Profile.create({ userId: user._id });
            }
        }

        console.log('--- SEED COMPLETE ---');
        process.exit(0);
    } catch (error) {
        console.error('SEED FAILED:', error.message);
        process.exit(1);
    }
};

recreateUsers();
