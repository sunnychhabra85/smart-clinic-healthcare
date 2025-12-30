const {body, query, validationResult} = require("express-validator");
const { ValidationError } = require("../utils/errors");

/***
 * Validation middleware - check validation results
 */

const validate = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        // return res.status(400).json({
        //     success: false,
        //     errors: errors.array()
        // })
        const errorMessages = errors.array().map(err => err.msg);
        throw new ValidationError(errorMessages.join(', '));
    }
    next();
}

/**
 * Patient Creation validation rule
 */

const validateCreatePatient = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({min: 2})
        .withMessage('First name must be atleast 2 characters long'),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({min: 2})
        .withMessage('Last name must be atleast 2 characters long'),
    body("email")
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body("dateOfBirth")
        .isISO8601()
        .isISO8601()
        .withMessage('Date of birth must be a valid ISO 8601 date'),
    body("userId")
        .trim()
        .notEmpty()
        .withMessage('User ID is required'),
    body("gender")
        .optional()
        .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
        .withMessage("Gender must be one of: male, female, other, prefer_not_to_say"),
    body("phone")
        .optional()
        .trim()
        .isMobilePhone()
        .withMessage("Phone number must be a valid mobile phone number"),
    validate
];

/**
 * Patient Updation validation rule
 */

const validateUpdatePatient = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({min: 2})
        .withMessage('First name must be atleast 2 characters long'),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({min: 2})
        .withMessage('Last name must be atleast 2 characters long'),
    body("email")
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body("dateOfBirth")
        .isISO8601()
        .isISO8601()
        .withMessage('Date of birth must be a valid ISO 8601 date'),
    body("gender")
        .optional()
        .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
        .withMessage("Gender must be one of: male, female, other, prefer_not_to_say"),
    validate
];

module.exports = {
    validate,
    validateCreatePatient,
    validateUpdatePatient,
}