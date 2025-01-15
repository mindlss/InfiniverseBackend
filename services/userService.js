const User = require('../models/User');

/**
 * Найти пользователя по ID
 * @param {String} userId - ID пользователя
 * @returns {Promise<Object>} - Данные пользователя
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Пользователь не найден');
    }
    return user;
};

/**
 * Найти пользователя по Discord ID
 * @param {String} discordId - Discord ID пользователя
 * @returns {Promise<Object>} - Данные пользователя
 */
const getUserByDiscordId = async (discordId) => {
    const user = await User.findOne({ discordId });
    if (!user) {
        throw new Error('Пользователь с таким Discord ID не найден');
    }
    return user;
};

/**
 * Создать нового пользователя
 * @param {Object} userData - Данные пользователя (username, email, discordId, roles)
 * @returns {Promise<Object>} - Созданный пользователь
 */
const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

/**
 * Обновить данные пользователя
 * @param {String} userId - ID пользователя
 * @param {Object} updates - Обновляемые данные
 * @returns {Promise<Object>} - Обновленный пользователь
 */
const updateUser = async (userId, updates) => {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
        throw new Error('Пользователь не найден для обновления');
    }
    return user;
};

/**
 * Удалить пользователя
 * @param {String} userId - ID пользователя
 * @returns {Promise<Object>} - Удаленный пользователь
 */
const deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new Error('Пользователь не найден для удаления');
    }
    return user;
};

/**
 * Получить всех пользователей
 * @returns {Promise<Array>} - Список пользователей
 */
const getAllUsers = async () => {
    const users = await User.find();
    return users;
};

module.exports = {
    getUserById,
    getUserByDiscordId,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
};
