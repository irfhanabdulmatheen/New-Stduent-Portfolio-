const mongoose = require('mongoose');
require('dotenv').config();

const testConn = async () => {
    console.log('Testing connection to:', process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 2000, // 2 seconds
        });
        console.log('SUCCESS: MongoDB is reachable');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: MongoDB is NOT reachable:', err.message);
        process.exit(1);
    }
};

testConn();
