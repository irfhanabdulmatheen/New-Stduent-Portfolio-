const mongoose = require('mongoose');
require('dotenv').config();
const StudentController = require('./controllers/studentController');
const User = require('./models/User');

(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-portfolio');
    const user = await User.findOne({ email: 'student@example.com' });
    if (!user) {
        console.error('Student not found');
        process.exit(1);
    }

    const req = {
        body: {
            title: 'Automated test project',
            description: 'Testing add project flow',
            technologies: 'React,Node',
            githubLink: 'https://github.com/test/test'
        },
        user: { _id: user._id }
    };

    const res = {
        status(code) { this.statusCode = code; return this; },
        json(payload) { console.log('response', this.statusCode || 200, payload); }
    };

    try {
        await StudentController.addProject(req, res);
    } catch (error) {
        console.error('controller throw', error);
    } finally {
        await mongoose.disconnect();
    }
})();
