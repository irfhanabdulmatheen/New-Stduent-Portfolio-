const mongoose = require('mongoose');
const { login } = require('./controllers/authController');

const simulateLogin = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/student-portfolio');
  const req = {
    body: { email: 'student@example.com', password: 'password123' },
    get() { return undefined; }
  };
  const res = {
    status(code) { this.code = code; return this; },
    json(payload) { console.log('response', this.code || 200, payload); }
  };
  await login(req, res);
  await mongoose.disconnect();
};

simulateLogin().catch(err => {
  console.error('simulate error', err.message);
  mongoose.disconnect();
});
