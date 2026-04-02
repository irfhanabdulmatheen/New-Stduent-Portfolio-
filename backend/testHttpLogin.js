const http = require('http');
const data = JSON.stringify({ email: 'student@example.com', password: 'password123' });

const options = {
  hostname: '127.0.0.1',
  port: 5005,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log('statusCode', res.statusCode);
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('body', body);
  });
});

req.on('error', (error) => console.error('request error', error));
req.write(data);
req.end();
