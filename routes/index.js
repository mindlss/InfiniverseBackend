const express = require('express');
const router = express.Router();
const authenticateJWT = require('../utils/authMiddleware');

router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Доступ разрешен', user: req.user });
});

module.exports = router;
