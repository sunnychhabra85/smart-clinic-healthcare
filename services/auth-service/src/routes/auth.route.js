const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateRefreshToken} = require("../middleware/validation.middleware")

console.log('Setting up auth routes');

// Register a new user
router.post('/register', validateRegister, authController.register)
      .post('/login', validateLogin, authController.login);
router.post("/refresh-token", validateRefreshToken, authController.refreshToken)
router.post("/logout", authController.logout);
router.post("/profile", authController.getProfile)



module.exports = router;

