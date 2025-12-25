const express = require('express');
const config = require('./config');

const logger = require("./utils/logger")
const {errorHandler, notFoundError, notFoundHandler} = require('./middleware/error.middleware')

//connect to database
const connectDB = require('./config/database');

//initialize express app
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//import routes
const authRoutes = require('./routes/auth.route');
//user auth routes
app.use('/api/auth', authRoutes);

//404 not found handler
app.use(notFoundHandler);

//global handler error
app.use(errorHandler)

//start server
const startServer = async () => {
    try {
        //connect to databasea
        await connectDB()

        //start listing server
        const PORT = process.env.PORT || config.port || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            logger.info(`${config.serviceName} is running on port ${PORT}`)
        });

    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
}

//handle unhandled promise rejections
process.on('unhandledRejection', (error)=>{
    logger.error(`Unhandled Promise Rejection: ${error.message}`)
    process.exit(1)
})

//handle uncaught exeption
process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    process.exit(1)
})

//start the server
startServer();