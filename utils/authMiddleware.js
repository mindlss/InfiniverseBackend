/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Импорт модели пользователя
const BlacklistedToken = require('../models/BlacklistedToken');

const authenticateJWT = async (req, res, next) => {
    try {
        // Извлекаем токен из хедера Authorization или тела запроса
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : req.body.token;

        if (!token) {
            return res.status(401).json({ message: 'Токен не предоставлен' });
        }

        const blacklistedToken = await BlacklistedToken.findOne({ token });
        if (blacklistedToken) {
            return res
                .status(401)
                .json({
                    message: 'Токен отозван, требуется повторная авторизация',
                });
        }

        // Проверяем токен
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err && err.name === 'TokenExpiredError') {
                // Если токен истёк, проверяем refreshToken
                const { refreshToken } = req.body;

                if (!refreshToken) {
                    return res
                        .status(401)
                        .json({
                            message:
                                'Токен истёк, Refresh Token не предоставлен',
                        });
                }

                try {
                    // Проверяем валидность refreshToken
                    const decoded = jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET
                    );

                    const dbUser = await User.findById(decoded.id);

                    if (!dbUser || dbUser.refreshToken !== refreshToken) {
                        return res
                            .status(403)
                            .json({ message: 'Неверный Refresh Token' });
                    }

                    // Генерация нового accessToken
                    const newAccessToken = jwt.sign(
                        { id: dbUser.id, roles: dbUser.roles },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );

                    // Отправляем новый токен в ответ
                    res.setHeader('x-new-access-token', newAccessToken);

                    // Добавляем пользователя в req.user и продолжаем
                    req.user = {
                        id: dbUser.id,
                        roles: dbUser.roles,
                    };
                    return next();
                } catch (refreshErr) {
                    return res
                        .status(403)
                        .json({ message: 'Недействительный Refresh Token' });
                }
            } else if (err) {
                // Любая другая ошибка токена
                return res
                    .status(403)
                    .json({ message: 'Недействительный токен' });
            }

            // Если токен валиден
            req.user = user; // Данные из токена
            next();
        });
    } catch (error) {
        console.error('Ошибка в мидлваре аутентификации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = authenticateJWT;
