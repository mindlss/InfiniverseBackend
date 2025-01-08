const express = require('express');
const router = express.Router();
const authenticateJWT = require('../utils/authMiddleware');
const { rolesHasAny, permissionsHasAll } = require('../utils/roleMiddleware');

router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Доступ разрешен', user: req.user });
});

router.get('/user', authenticateJWT, rolesHasAny(['user']), (req, res) => {
    res.json({ message: 'user' });
});

router.get('/admin', authenticateJWT, rolesHasAny(['admin']), (req, res) => {
    res.json({ message: 'admin' });
});

router.get(
    '/view',
    authenticateJWT,
    permissionsHasAll(['view:post']),
    (req, res) => {
        res.json({ message: 'Просмотр' });
    }
);

module.exports = router;
