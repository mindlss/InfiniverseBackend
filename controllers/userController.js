/* eslint-disable no-unused-vars */
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');

const logoutUser = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Токен не предоставлен' });
    }

    try {
        // Добавляем токен в черный список
        const blacklistedToken = new BlacklistedToken({
            token,
            addedAt: new Date(),
        });
        await blacklistedToken.save();

        res.json({ message: 'Вы успешно вышли' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при выходе из системы' });
    }
};

// Получение текущего пользователя
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCurrentUser, logoutUser };
