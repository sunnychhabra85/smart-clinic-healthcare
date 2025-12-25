const authService = require('../services/auth.service');
const {validationError} = require("../utils/errors")
const logger = require("../utils/logger")
/**
 * Authentication Controller
 */

/**
 * Registers a new user.
 * POST /api/auth/register
 * Body: { name, email, password }
 * Response: { message, userId }
 */

const register = async (req, res, next) => {
    try {
        console.log('Register endpoint hit with data:', req.body);
        // Registration logic here
        const userData = req.body;
        const result = await authService.register(userData);
        console.log("Result: ", result)
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully', 
            data: result
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        next(error);
    }
}

/**
 * Logs in a user.
 */
const login = async (req, res, next) => {
    try {
        console.log('Login endpoint hit with data:', req.body); 
        const { email, password } = req.body;
        if(!email || !password) {
            throw new validationError('Email and password are required');
        }
        const result = await authService.login(email, password);
        console.log('Login successful for result:', result);
        res.status(200).json({ 
            success: true,
            message: 'User logged in successfully', 
            data: result
        });
    } catch (error) {
        console.error('Login error:', error.message);
        next(error);
    }
}

/**
 * Logs out a user.
 */
const logout = async (req, res, next) =>{
    try{
        const userId = req.user.id;
        await authService.logout(userId)
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    }catch(err){
        next(err)
    }
}

/**
 * Refreshes access tokens.
 */

const refreshToken = async (req, res, next) => {
    try{
        const {refreshToken} = req.body;
        if(!refreshToken){
            throw new validationError("Refresh token is required");
        }

        const result = await authService.refreshToken()
        res.status(200).json({
            success: true,
            message: "Access token refresh successfully"
        })
    }
    catch(err){
        next(err)
    }
}

/**
 * Gets the profile of the logged-in user.
 */
const getProfile = async (req, res, next) =>{
    const userId = req.user.id;
    const profile = await authService.getProfile(userId);
    res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: profile
    })
}

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    getProfile
};