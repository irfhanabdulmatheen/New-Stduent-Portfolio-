const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseName: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true
    },
    issuedBy: {
        type: String,
        trim: true,
        default: ''
    },
    completionDate: {
        type: Date
    },
    certificateFile: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
