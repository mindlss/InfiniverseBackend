const express = require('express');
const { getCurrentUser, logoutUser } = require('../controllers/userController');
const authenticateJWT = require('../utils/authMiddleware');
const router = express.Router();

router.post('/me', authenticateJWT, getCurrentUser);
router.post('/logout', authenticateJWT, logoutUser);

module.exports = router;
