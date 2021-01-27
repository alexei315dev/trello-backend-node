const express = require("express");
const router = express.Router();
const verify = require('../middleware/verifyToken');
const authController = require('../controllers/authController');

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get('/me', verify, authController.getUser)

module.exports = router;