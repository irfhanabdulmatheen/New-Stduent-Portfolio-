
const axios = require('axios');

const testAdd = async () => {
    try {
        console.log('Testing Project Add...');
        // We'd need a real token here to test properly, but we can check if the server is up
        const res = await axios.get('https://new-stduent-portfolio.onrender.com/api/health');
        console.log('Health check:', res.data);
    } catch (err) {
        console.error('Server is DOWN:', err.message);
    }
};

testAdd();
