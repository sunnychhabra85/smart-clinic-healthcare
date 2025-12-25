require('dotenv').config();

module.exports = {
    //Server
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    serviceName: process.env.SERVICE_NAME || 'auth-service',

    // MongoDB
    mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_db',

    //JWT
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    jwtRefereshSecret: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',


    //Security

    //Logging
}