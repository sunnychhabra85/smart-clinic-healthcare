require("dotenv").config();

module.exports = {
    // Server
    port: process.env.port || 5001,
    nodeEnv: process.env.NODE_ENV || 'development',
    serviceName: process.env.SERVICE_NAME || 'Patient Service',

    // MongoDB
    mongodbUri: process.env.MONGO_URI || 'mongodb://localhost:27017/patient_db',

    // Auth Service (for token validaton)
    authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:5000',

    // Logging
    logLevel: process.env.LOG_LEVEL || 'info'       
}

