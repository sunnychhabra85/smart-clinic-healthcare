/***
 * Custom Application Error Class
 */

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message || 'Validation Error', 400);
    }
}
 class AuthenticationError extends AppError {
    constructor(message) {
        super(message || 'Authentication Failed', 401);
    }   
}
class NotFoundError extends AppError {
    constructor(message) {
        super(message || 'Resource Not Found', 404);
    }       
}

class AuthorizationError extends AppError {
    constructor(message) {
        super(message || 'Authorization Failed', 403);
    }
} 
class ConflitError extends AppError {
    constructor(message) {
        super(message || 'Resource Conflict', 409);
    }   
}
module.exports = { AppError, ValidationError, NotFoundError, AuthenticationError, AuthorizationError, ConflitError };