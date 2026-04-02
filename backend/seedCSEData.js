require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');

const Certification = require('./models/Certification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student-portfolio';

const seedCSEData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Find the dummy student
        const student = await User.findOne({ email: 'student@example.com' });
        
        if (!student) {
            console.log('Dummy student not found. Please run seedDummyUsers.js first.');
            process.exit(1);
        }

        const studentId = student._id;

        // Clean up existing data for this student
        await Project.deleteMany({ userId: studentId });
        await Certification.deleteMany({ userId: studentId });
        console.log('Cleared existing data for the student');


        // 2. Add Projects
        const projects = [
            {
                userId: studentId,
                title: 'AI Chatbot Assistant',
                description: 'A full-stack AI chatbot application utilizing natural language processing to answer common university FAQs. Built with Python, Flask, and React.',
                technologies: ['Python', 'React', 'Flask', 'NLP'],
                githubLink: 'https://github.com/example/ai-chatbot',
                status: 'approved'
            },
            {
                userId: studentId,
                title: 'E-Commerce Platform',
                description: 'A scalable MERN stack e-commerce web application featuring user authentication, payment processing, and an admin dashboard.',
                technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'Stripe'],
                githubLink: 'https://github.com/example/mern-ecommerce',
                status: 'approved'
            },
            {
                userId: studentId,
                title: 'Distributed File System',
                description: 'A lightweight distributed file system built in Go, focusing on fault tolerance and high availability.',
                technologies: ['Go', 'Distributed Systems', 'Docker'],
                githubLink: 'https://github.com/example/dfs-go',
                status: 'pending'
            }
        ];
        
        await Project.insertMany(projects);
        console.log('Added CSE Projects');

        // 3. Add Certifications
        const certifications = [
            {
                userId: studentId,
                courseName: 'AWS Certified Cloud Practitioner',
                issuedBy: 'Amazon Web Services',
                completionDate: new Date('2024-11-15')
            },
            {
                userId: studentId,
                courseName: 'Meta Front-End Developer Professional Certificate',
                issuedBy: 'Coursera',
                completionDate: new Date('2024-05-20')
            },
            {
                userId: studentId,
                courseName: 'Machine Learning Specialization',
                issuedBy: 'Stanford University (Coursera)',
                completionDate: new Date('2023-12-10')
            }
        ];
        await Certification.insertMany(certifications);
        console.log('Added CSE Certifications');

        console.log('Successfully seeded CSE dummy data!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedCSEData();
