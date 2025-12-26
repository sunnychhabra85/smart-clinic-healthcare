const { verifyAccessToken, extractTokenFromHeader} = require("../utils/jwt");
const { AuthenticationError} = require("../utils/errors")

/**
 * Authentication middleware - Verify JWT access token
 */
const authenticate = (req, res, next) =>{
    try{
        //Extract token from authorization header
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);
        if(!token){
            throw new AuthenticationError("No token provided")
        }

        //verify token
        const decoded = verifyAccessToken(token);
        //attach user info to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            roles: decoded.roles
        }

        next();
    }catch(error){
        if(error instanceof AuthenticationError || error.message.includes('token')){
            res.status(401).json({
                error: true,
                message: error.message
            })
        }
        next(error);
    }
}

module.exports = {
    authenticate
}