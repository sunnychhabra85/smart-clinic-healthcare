const {AuthorizationError} = require("../utils/errors")
const { USER_ROLES } = require("../models/User");

/***
 * RBAC Middleware - Check if user has required roles
 * @param {Array} requiredRoles - Array of roles allowed to access the route
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
                error: true,
                message: "Forbidden: You don't have permission to access this resource",
                required: roles,
                current: userRoles
            })
            // throw new AuthorizationError('Access denied');
        }
        next();
    };
}


/***
 * RBAC Middleware - Check if user has any of the required roles
 * @param {Array} requiredRoles - Array of roles allowed to access the route
 * @Return {Function} - Middleware function
 */
// const checkRoles = (requiredRoles) => {
//     return (req, res, next) => {
//         const user = req.user;
//         if (!user || !user.roles) {
//             throw new AuthorizationError('Access denied');
//         }
//         const hasRequiredRole = user.roles.some(role => requiredRoles.includes(role));
//         if (!hasRequiredRole) {
//             throw new AuthorizationError('Access denied');
//         }
//         next();
//     };
// };
const requiredAnyRole = (...roles) => {
    return requiredRole(...roles);
}

/***
 * RBAC Middleware - Check if user has all of the required roles
 * @param {Array} requiredRoles - Array of roles required to access the route
 * @Return {Function} - Middleware function
 */
const requiredAllRoles = (...roles) => {
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
        const hasAllRoles = roles.every(role => userRoles.includes(role));
        if (!hasAllRoles) {
            return res.status(403).json({
                error: true,
                message: "Forbidden: You don't have permission to access this resource",
                required: roles,
                current: userRoles
            })
            // throw new AuthorizationError('Access denied');
        }
        next();
    };
}

/***
 * Predefined middleware for common roles
 */
const requiredAdmin = requiredRole(USER_ROLES.ADMIN);
const requiredDoctor = requiredRole(USER_ROLES.DOCTOR, USER_ROLES.CLINICIAN);
const requiredClinician = requiredRole(USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.CLINICIAN);
const requiredPatient = requiredRole(USER_ROLES.PATIENT);

module.exports = {
    requiredRole,
    requiredAnyRole,
    requiredAllRoles,
    requiredAdmin,
    requiredDoctor,
    requiredClinician,
    requiredPatient
}   