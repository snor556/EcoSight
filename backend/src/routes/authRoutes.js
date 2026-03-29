const express = require('express');
const router = express.Router();

// Import the controller we just built!
const { register,login,updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware.js');

// Map the POST request to the register function
router.post('/register', register);
router.post('/login', login);
router.put('/profile', protect, updateUserProfile)

// (We will add the /login route here later)

module.exports = router;