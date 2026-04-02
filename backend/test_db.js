const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('SUCCESS: MongoDB connected');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: MongoDB connection error:', err.message);
        process.exit(1);
    });

setTimeout(() => {
    console.log('TIMEOUT: MongoDB connection took too long');
    process.exit(1);
}, 10000);
