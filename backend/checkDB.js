const mongoose = require('mongoose');
const User = require('./models/User');

const check = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/student-portfolio');
        const users = await User.find();
        console.log('Users in DB:', users.map(u => ({ email: u.email, role: u.role, isActive: u.isActive })));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
check();
