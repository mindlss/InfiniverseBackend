const City = require('../models/City');
const User = require('../models/User');

/**
 * Найти город по ID
 * @param {String} cityId - ID города
 * @returns {Promise<Object>} Данные города
 */
const getCityById = async (cityId) => {
    const city = await City.findById(cityId).populate('country').populate('users');
    if (!city) {
        throw new Error('Город не найден');
    }
    return city;
};

/**
 * Найти город по имени
 * @param {String} cityName - Имя города
 * @returns {Promise<Object>} Данные города
 */
const getCityByName = async (cityName) => {
    const city = await City.findOne({ name: cityName }).populate('country').populate('users');
    if (!city) {
        throw new Error('Город с таким именем не найден');
    }
    return city;
};

/**
 * Получить города по стране
 * @param {String} countryId - ID страны
 * @returns {Promise<Array>} Список городов страны
 */
const getCitiesByCountry = async (countryId) => {
    const cities = await City.find({ country: countryId }).populate('country').populate('users');
    return cities;
};

/**
 * Создать новый город
 * @param {Object} cityData - Данные города (name, country)
 * @returns {Promise<Object>} Созданный город
 */
const createCity = async (cityData) => {
    const city = new City(cityData);
    await city.save();
    return city;
};

/**
 * Обновить данные города
 * @param {String} cityId - ID города
 * @param {Object} updates - Обновляемые данные
 * @returns {Promise<Object>} Обновленный город
 */
const updateCity = async (cityId, updates) => {
    const city = await City.findByIdAndUpdate(cityId, updates, { new: true }).populate('country').populate('users');
    if (!city) {
        throw new Error('Город не найден для обновления');
    }
    return city;
};

/**
 * Удалить город
 * @param {String} cityId - ID города
 * @returns {Promise<Object>} Удаленный город
 */
const deleteCity = async (cityId) => {
    const city = await City.findByIdAndDelete(cityId);
    if (!city) {
        throw new Error('Город не найден для удаления');
    }
    return city;
};

/**
 * Получить список всех городов
 * @returns {Promise<Array>} Список городов
 */
const getAllCities = async () => {
    const cities = await City.find().populate('country').populate('users');
    return cities;
};

/**
 * Добавить игрока в город
 * @param {String} cityId - ID города
 * @param {String} userId - ID пользователя
 * @returns {Promise<Object>} Обновленный город
 */
const addUserToCity = async (cityId, userId) => {
    const city = await City.findById(cityId);
    if (!city) {
        throw new Error('Город не найден');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Пользователь не найден');
    }

    // Добавляем игрока в город, если его там нет
    if (!city.users.includes(userId)) {
        city.users.push(userId);
        await city.save();
    }

    return city;
};

/**
 * Удалить игрока из города
 * @param {String} cityId - ID города
 * @param {String} userId - ID пользователя
 * @returns {Promise<Object>} Обновленный город
 */
const removeUserFromCity = async (cityId, userId) => {
    const city = await City.findById(cityId);
    if (!city) {
        throw new Error('Город не найден');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Пользователь не найден');
    }

    // Удаляем игрока из города
    city.users = city.users.filter(id => id.toString() !== userId);
    await city.save();

    return city;
};

/**
 * Получить всех игроков города
 * @param {String} cityId - ID города
 * @returns {Promise<Array>} Список игроков города
 */
const getUsersInCity = async (cityId) => {
    const city = await City.findById(cityId).populate('users');
    if (!city) {
        throw new Error('Город не найден');
    }

    return city.users;
};

module.exports = {
    getCityById,
    getCityByName,
    getCitiesByCountry,
    createCity,
    updateCity,
    deleteCity,
    getAllCities,
    addUserToCity,
    removeUserFromCity,
    getUsersInCity,
};
