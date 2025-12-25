const mongoose = require('mongoose');
// const logger = require('../utils/logger');

/***
 * connect to MongoDB database
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_db';

        await mongoose.connect(mongoURI);
        // logger.info('MongoDB connected successfully');
        console.log('MongoDB connected successfully');
    } catch (err) {
        // logger.error('MongoDB connection error:', err.message);
        console.log('MongoDB connection error:', err.message);
        process.exit(1);
    }   
}
module.exports = connectDB;