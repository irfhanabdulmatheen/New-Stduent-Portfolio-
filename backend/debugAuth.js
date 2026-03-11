const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const debug = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-portfolio');
        console.log('Connected!');

        const email = 'debug@test.com';
        const password = 'password123';

        // Delete if exists
        await User.deleteOne({ email });
        console.log('Cleaned up existing debug user.');

        // Create new user
        const user = new User({
            name: 'Debug User',
            email,
            password,
            role: 'student'
        });

        console.log('Saving user...');
        await user.save();
        console.log('User saved. Password hash in DB:', user.password);

        // Fetch again to be sure
        const fetchedUser = await User.findOne({ email });
        console.log('Fetched user from DB. Comparing password...');

        const isMatch = await fetchedUser.comparePassword(password);
        console.log('Match result:', isMatch);

        if (isMatch) {
            console.log('SUCCESS: Password comparison works correctly.');
        } else {
            console.error('FAILURE: Password comparison failed!');
        }

        // Clean up
        await User.deleteOne({ email });
        process.exit(isMatch ? 0 : 1);
    } catch (err) {
        console.error('DEBUG ERROR:', err);
        process.exit(1);
    }
};

debug();
