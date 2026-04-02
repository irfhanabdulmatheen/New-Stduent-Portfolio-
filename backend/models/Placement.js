const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true
    },
    package: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['Placed', 'Pending', 'Rejected'],
        default: 'Pending'
    },
    date: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Placement', placementSchema);
