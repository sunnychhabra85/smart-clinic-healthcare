const {body, validationResult} = require("express-validator");

/***
 * Validation middleware - check validation result
 */

const validate = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            errors: errors.array()
        })
    }
    next();
}

/**
 * Register validation rule
 */

const validateRegister = [
    body("email")
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body("password")
        .isLength({min: 6})
        .withMessage('Password must be atleast 6 charaters long')
        .matches(/\d/)
        .withMessage("Password must contain atleast one number"),
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
    body("roles")
        .optional()
        .isArray()
        .withMessage("Roles must be an array of strings"),
    validate,
];

/**
 * Login validation rules
 */
const validateLogin = [
    body("email")
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    validate,
]

/**
 * Refresh token validation rule 
 */
const validateRefreshToken = [
    body("refreshToken")
        .notEmpty()
        .withMessage("Refresh token is required"),
    validate
]

module.exports = {
    validate,
    validateRegister,
    validateLogin,
    validateRefreshToken
}