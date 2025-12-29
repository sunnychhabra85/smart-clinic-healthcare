const axios = require('axios');
const config = require('.../config');
const error = require('./errors');


/***
 * Validate JWT token with Auth Service
 * @param {string} token - JWT token
 * @returns {object} - Decoded User information if token is valid
 */
const validateToken = async (token) => {
    try {
        const response = await axios.get(`${config.authServiceUrl}/api/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.data.success) {
           return response.data.User;
        }   
        
        throw new error.AuthenticationError('Invalid or expired token');
    } catch (err) {
        if(err.response && err.response.status === 401){
            throw new error.AuthorizationError('Invalid or expired token');
        }
        if(err.code === 'ECONNREFUSED'){
            throw new error.AppError('Authentication Service Unavailable');
        }
        throw new error.AuthenticationError(err.message || 'Token validation failed');
        
    }
};

/***
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string} - Extracted token
 */
const extractTokenFromHeader = (authHeader) =>{
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return null;
    }
    const parts = authHeader.split(' ');
    if(parts.length !== 2 || !parts[0] !== 'Bearer'){
        return null;
    }
    return parts[1];
}

module.exports = {
    validateToken,
    extractTokenFromHeader
}