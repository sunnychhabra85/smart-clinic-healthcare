const { User, USER_ROLES, USER_STATUS } = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { 
    AuthenticationError, 
    ConflictError, 
    NotFoundError
} = require('../utils/errors');
const logger = require('../utils/logger');

/***
 * Register a new user
 * @param {Object} userData - User data (firstName, lastName, email, password, roles)
 * @Return {Object} - Registered user data and tokens
 */
const register = async (userData) => {
    const { firstName, lastName, email, password, roles } = userData;
    // Check if user already exists
    // const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        throw new ConflictError('User already exists with this email');
    }

    //set default role if not provided
    const userRoles = roles && roles.length > 0 ? roles : [USER_ROLES.PATIENT];

    //create new user
    const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        password,
        roles: userRoles,
        status: USER_STATUS.ACTIVE,
    });

    //save user to database
    await user.save();

    //generate auth tokens
    const tokenPayload = {
        id: user._id.toString(),
        email: user.email,
        roles: user.roles,
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    //save refresh token to user document
    // user.refreshToken = refreshToken;
    // user.lastLogin = new Date();
    // await user.save({ validateBeforeSave: false });
    await user.updateOne(
        { _id: user._id },
        { $set: { refreshToken, lastLogin: new Date(), } }
    );
    logger.info(`New user registered: ${user.email}`);

    //return user data and tokens

    return {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: user.roles,
            status: user.status,
        },
        accessToken,
        refreshToken,
    };
}

/***
 * Login user with email and password
 * @param {String} email - User email
 * @param {String} password - User password
 * @Return {Object} - User data and tokens
 */

const login = async (email, password) => {
    //find the user by email with password field
    const user = await User.findByEmail(email).select('+password');
    console.log('User found for login:', user);
    //if user exist or not
    if (!user) {
        throw new AuthenticationError('Invalid email or password');
    }

    // if user is active
    if (user.status !== USER_STATUS.ACTIVE) {
        throw new AuthenticationError('User account is not active');
    }

    // verify password
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password validity:', isPasswordValid);
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
    }

    // generate auth tokens
    const tokenPayload = {
        id: user._id.toString(),
        email: user.email,
        roles: user.roles,
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    // // update refresh token in db
    // user.refreshToken = refreshToken;
    // user.lastLogin = new Date();
    // // Mark password as not modified to prevent re-hashing
    // user.markModified('refreshToken');
    // if (user.isModified('password')) {
    //     user.password = user.password; // Keep the original hashed password
    // }
    // console.log('Updating user with new refresh token and last login time', user);
    // await user.save({ validateBeforeSave: false });
    // console.log('User updated successfully after login');
    await user.updateOne(
        { _id: user._id },
        { $set: { refreshToken, lastLogin: new Date(), } }
    );
    logger.info(`User logged in: ${user.email}`);

    // return user data and tokens
    return {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: user.roles,
            status: user.status,
        },
        accessToken,
        refreshToken
    };
}

/***
 * Refresh access token using refresh token
 * @param {String} token - JWT refresh token
 * @Return {Object} - New access token 
 */
const refreshToken = async (token) => {
    try{
 //verify old refresh token
    const decoded = verifyRefreshToken(oldRefreshToken);
    if (!decoded || !decoded.userId) {
        throw new AuthenticationError('Invalid refresh token');
    }
    //find user by id
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
        throw new AuthenticationError('Invalid refresh token');
    }

    if(user.status !== USER_STATUS.ACTIVE) {
        throw new AuthenticationError('User account is not active');
    }

    const tokenPayload = {
        id: user._id.toString(),
        email: user.email,
        roles: user.roles,
    };
    const newAccessToken = generateAccessToken(tokenPayload);
    logger.info(`Access token refreshed for user: ${user.email}`);

    return {
        accessToken: newAccessToken,
    };
    }catch(err){
        throw new AuthenticationError('Invalid or expired refresh token');
    }
}

/***
 * Logout user (invalidate refresh token)
 * @param {String} userId - UserId
 * 
 */
const logout = async (userId) => {
    //find user by id
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    //invalidate refresh token
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged out: ${user.email}`)
}

/***
 * Get User Profile by userId
 * @param {String} userId - UserId
 * @Return {Object} - User Profile
 */
const getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        status: user.status,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
    };
}

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getProfile
};