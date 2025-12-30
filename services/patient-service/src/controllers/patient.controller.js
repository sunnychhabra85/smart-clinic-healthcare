const patientService = require("../services/patient.service");
const {ValidationError} = require("../utils/errors");
const logger = require("../utils/logger");

/***
 * Create a new Patient record
 */
const createPatient = async (req, res, next) =>{
    try{
        const patientData = req.body;
        //if userId not provided, user is authenticated, use authenticated user's id
        if(!patientData.userId && req.user){
            patientData.userId = req.user.userId;
        }
        const patient = await patientService.createPatient(patientData);
        res.status(201).json({
            success: true,
            message: "Patient created successfully",
            data: patient
        });
    }catch(error){
        next(error);
    }
}

module.exports = {
    createPatient
};