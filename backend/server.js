const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const ensureAdmin = require('./utils/ensureAdmin');

// Create Express app
const app = express();

// Connect to Database
const startServer = async () => {
    try {
        await connectDB();
        await ensureAdmin();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
const normalizeOrigin = (origin) => origin?.replace(/\/$/, '');
const configuredOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);

const allowedOrigins = [
    ...configuredOrigins,
    'http://localhost:3000',
    'http://localhost:5173'
].map(normalizeOrigin);

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server calls and tools without an Origin header.
        const normalizedOrigin = normalizeOrigin(origin);

        if (
            !normalizedOrigin ||
            allowedOrigins.includes(normalizedOrigin) ||
            /\.vercel\.app$/.test(new URL(normalizedOrigin).hostname)
        ) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/portfolio', require('./routes/public'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'Frontend origin is not allowed by CORS' });
    }
    if (err.name === 'MulterError') {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    const statusCode = err.status || 500;
    const message = err.message || 'Something went wrong!';
    res.status(statusCode).json({ message });
});

// End of server.js
