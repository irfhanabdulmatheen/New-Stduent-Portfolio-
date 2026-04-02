const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    rollNo: {
        type: String,
        trim: true,
        default: ''
    },
    degree: {
        type: String,
        trim: true,
        default: ''
    },
    currentArrears: {
        type: String,
        trim: true,
        default: '0'
    },
    cgpaSemesters: {
        type: [String],
        default: []
    },
    department: {
        type: String,
        trim: true,
        default: ''
    },
    year: {
        type: String,
        trim: true,
        default: ''
    },
    cgpa: {
        type: String,
        trim: true,
        default: ''
    },
    bio: {
        type: String,
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    profileImage: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
