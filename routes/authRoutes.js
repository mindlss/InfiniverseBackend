/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/discord', passport.authenticate('discord'));

router.get(
    '/discord/callback',
    passport.authenticate('discord', { session: false }),
    (req, res) => {
        const { user, accessToken } = req.user;

        if (!accessToken || !user.refreshToken) {
            return res.status(500).json({ message: 'Токены не сгенерированы' });
        }

        res.json({
            message: 'Успешная авторизация через Discord!',
            user,
            accessToken,
        });
    },
    (err, req, res, next) => {
        if (
            err &&
            err.message === 'Rate limit exceeded. Please try again later.'
        ) {
            return res.status(429).json({
                message: 'Rate limit exceeded. Please try again later.',
            });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
);

router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: 'Refresh Token не предоставлен' });
    }

    try {
        // Проверяем валидность Refresh Token
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Проверяем, существует ли пользователь и его Refresh Token
        const user = await User.findOne({ _id: decoded.id, refreshToken });

        if (!user) {
            return res.status(403).json({ message: 'Неверный Refresh Token' });
        }

        // Генерация нового Access Token
        const newAccessToken = jwt.sign(
            { id: user.id, permissions: user.permissions },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res
            .status(403)
            .json({ message: 'Недействительный Refresh Token' });
    }
});

module.exports = router;
