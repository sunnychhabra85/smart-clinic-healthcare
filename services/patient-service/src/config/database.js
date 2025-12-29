const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Database Connection
 */

const connectDatabase = async () =>{
    try{
        const mongodbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/patient_db';
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        await mongoose.connect(mongodbUri, options);
        // console.log("Connected to MongoDB");
        logger.info(`COnnected to MongoDB Successfully at ${mongodbUri}`);

        mongoose.connection.on('error', (err) => {
            logger.error("MongoDB connection error:", err);
        })

        mongoose.connection.on('disconnected',() => {
            logger.warn("MongoDB disconnected. Attempting to reconnect...");
            // setTimeout(connectDatabase, 5000);  // retrying connection after 5 seconds
        })
    }catch(error){
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDatabase