const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const students = [
    {
        name: 'Irfhan',
        email: 'irfhan@gmail.com',
        password: 'irfhan',
        role: 'student'
    },
    {
        name: 'Jaivant',
        email: 'jaivant@gmail.com',
        password: 'jaivant',
        role: 'student'
    }
];

const seedStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const studentData of students) {
            const existingUser = await User.findOne({ email: studentData.email });
            if (existingUser) {
                console.log(`User ${studentData.email} already exists.`);
                continue;
            }

            const student = new User(studentData);
            await student.save();
            console.log(`Student created: ${studentData.email}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding students:', error);
        process.exit(1);
    }
};

seedStudents();
