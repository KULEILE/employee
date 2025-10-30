const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const attendanceRoutes = require('./routes/attendance');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', attendanceRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running', 
        timestamp: new Date().toISOString() 
    });
});

// 404 handler (after all routes)
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware (after 404)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
