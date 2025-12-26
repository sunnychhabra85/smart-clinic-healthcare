const jwt = require('jsonwebtoken');
const config = require('../config');
/**
 * Generate JWT access token
 * @param {Object} payload - The payload (userId, email, roles)
 * @Return {String} - JWT access token
 */

const generateAccessToken = (payload) => {
    const tokenPayload = {
        id: payload.id,
        email: payload.email,
        roles: payload.roles,
    }

    return jwt.sign(tokenPayload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
        issuer: config.serviceName,
    });
}

/**
 * * Generate JWT refresh token
 * @param {Object} payload - The payload (userId)
 * @Return {String} - JWT refresh token
 */

const generateRefreshToken = (payload) => {
    const tokenPayload = {
        id: payload.userId,
    }
    return jwt.sign(tokenPayload, config.jwtRefereshSecret, {
        expiresIn: config.jwtRefreshExpiresIn,
        issuer: config.serviceName,
    });
}

/**
 * * Verify JWT token
 * @param {String} token - JWT token
 * @Return {Object} - Decoded payload
 */

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (err.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        }
    }
}


/**
 * @param {String} token - JWT refresh token to verify
 * @return {Object} - Decoded token payload
 */

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Error('Refresh token has expired');
        } else if (err.name === 'JsonWebTokenError') {
            throw new Error('Invalid refresh token');
        }
    }
}

/**
 * Extract token from Authorization header
 * @param {String} authheader - Authorization header value
 * @return {String || null} - Extract token from header
 */

const extractTokenFromHeader = (authheader) => {
    if (!authheader || !authheader.startsWith('Bearer ')) {
        return null;
    }
    const parts =  authheader.split(' ');
    if(parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    extractTokenFromHeader
};