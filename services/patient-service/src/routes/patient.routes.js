const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateCreatePatient } = require('../middlewares/validator.middleware');
const { requiredPatientClinicianRole } = require('../middlewares/rbac.middleware');

router.post('/', 
    authenticate,
    requiredPatientClinicianRole,
    validateCreatePatient, 
    patientController.createPatient
);

module.exports = router;