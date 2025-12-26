const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateRefreshToken} = require("../middleware/validation.middleware");
const { authenticate} = require("../middleware/auth.middleware");

// Register a new user
router.post('/register', validateRegister, authController.register)
      .post('/login', validateLogin, authController.login);
router.post("/refresh-token", validateRefreshToken, authController.refreshToken)
router.post("/logout", authenticate, authController.logout);
router.get("/profile", authenticate, authController.getProfile)



module.exports = router;

