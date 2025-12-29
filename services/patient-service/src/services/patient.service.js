const {Patient, PATIENT_STATUS} = require('../models/Patient')
const {ValidationError, ConflitError, AuthenticationError} = require('../utils/errors');

/***
 * Create a new patient record
 * @param {Object} patientData - Data for the new patient
 * @returns {Object} - Created patient record
 */
const createPatient = async (patientData) => {
    //check if patient already exists with userId
    const {patientId, email} = patientData;
    if(patientId){
        const existingPatient = await Patient.findByUserId(userId);
        if(existingPatient){
            throw new ConflitError('Patient already exists for this userId');
        }
    }

    //check if patient already exists with email
    if(email){
        const existingByEmail = await Patient.findByEmail(email);
        if(existingByEmail){
            throw new ConflitError('Patient already exists with this email');
        }
    }
    const patient = new Patient({
        ...patientData,
        email: email ? email.toLowerCase() : undefined,
        status: PATIENT_STATUS.ACTIVE
    })

    //Save patient to database
    await patient.save();
    logger.info(`Patient created: ${patient._id} (${patient.userId})`);

    //return created patient
    return patient;
}

/***
 * Get patient by ID
 * @param {string} patientId - Patient ID
 * @returns {Object} - Patient record
 */

/***
 * Get patients by User ID
 * @param {string} userId - User ID from auth service
 * @return {Object} - Patient Object
 */

/***
 * Get all patients with pagination and filters
 * 
 */