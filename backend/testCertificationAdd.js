const mongoose = require('mongoose');
require('dotenv').config();
const StudentController = require('./controllers/studentController');
const User = require('./models/User');

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'student@example.com' });
    if (!user) {
        console.error('Student not found');
        process.exit(1);
    }

    const req = {
        body: {
            courseName: 'Test Cert',
            issuedBy: 'Testing Org',
            completionDate: '2024-12-01',
            link: 'https://example.com/cert'
        },
        user: { _id: user._id }
    };

    const res = {
        status(code) { this.statusCode = code; return this; },
        json(payload) { console.log('response', this.statusCode || 200, payload); }
    };

    try {
        await StudentController.addCertification(req, res);
    } catch (error) {
        console.error('controller throw', error);
    } finally {
        await mongoose.disconnect();
    }
})();
