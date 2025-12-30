const {validateToken, extractTokenFromHeader} = require('../utils/auth');
const {AuthenticationError} = require('../utils/errors')

/***
 * Authentication Middleware - Validate JWT token with Auth Service
 */
const athenticate = async(req, resizeBy, next) => {
    try{
        const authHeader = req.headers['authorization'];
        const token = extractTokenFromHeader(authHeader);

        if(!token){
            return res.json(401).status({
                success: false,
                message:"No token provided"
            })
        }

        //Validate token with Auth Service
        const user = await validateToken(token);

        //Attach user info to request object
        req.user ={
            userId: user.id,
            email: user.email,
            roles: user.roles
        }
    }catch(error){
        return res.status(401).json({
            success: false,
            message: error.message || 'Invalid or expired token'
        })
    }
}

module.exports = {
    athenticate
};