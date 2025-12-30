const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'Patient Service',
        status: 'Healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

router.get('/ready', (req, res) => {
    // Here you can add checks for database connectivity or other dependencies
    res.status(200).json({
        success: true,
        service: 'Patient Service',
        status: 'Ready',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;