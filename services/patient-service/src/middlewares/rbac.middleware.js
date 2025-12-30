const {AuthorizationError} = require("../utils/errors")
const { USER_ROLES, Pa } = require("../models/User");

/***
 * RBAC Middleware - Check if user has required role(s)
 * @param {...String} roles - Required roles
 * @Return {Function} - Middleware function
 */
const requiredRole = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.roles) {
            return res.status(401).json({
                error: true,
                message: "Authentication required"
            })
            // throw new AuthorizationError('Access denied');
        }

        const userRoles = req.user.roles || [];
        const hasRequiredRole = roles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) {
            return res.status(403).json({
                success: false,
                message: "Access denied, Insufficinet permissions",
                required: roles,
                current: userRoles
            })
            // throw new AuthorizationError('Access denied');
        }
        next();
    };
}

/**
 * Required patient or clinician / admin roles
 */
const requiredPatientClinicianRole = requiredRole('patient', 'clinician', 'admin', 'doctor');

/***
 * Required clinician or admin roles ()heathcase provider only)
 */
const requiredClinician = requiredRole('clinician', 'admin', 'doctor');

/***
 * Required admin role
 */
const requiredAdminRole = requiredRole('admin');

module.exports = {
    requiredRole,
    requiredPatientClinicianRole,
    requiredClinician,
    requiredAdminRole
};
 