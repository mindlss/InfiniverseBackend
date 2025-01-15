const City = require('../models/City');

/**
 * Найти город по ID
 * @param {String} cityId - ID города
 * @returns {Promise<Object>} Данные города
 */
const getCityById = async (cityId) => {
    const city = await City.findById(cityId).populate('country');
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
    const city = await City.findOne({ name: cityName }).populate('country');
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
    const cities = await City.find({ country: countryId }).populate('country');
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
    const city = await City.findByIdAndUpdate(cityId, updates, { new: true }).populate('country');
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
    const cities = await City.find().populate('country');
    return cities;
};

/**
 * Создать банковский счёт для города
 * @param {String} cityId - ID города
 * @param {String} currencyId - ID валюты (опционально)
 * @returns {Promise<Object>} Созданный банковский счёт
 */
const createCityAccount = async (cityId, currencyId = null) => {
    const city = await getCityById(cityId);
    const account = await city.createCityAccount(currencyId);
    return account;
};

module.exports = {
    getCityById,
    getCityByName,
    getCitiesByCountry,
    createCity,
    updateCity,
    deleteCity,
    getAllCities,
    createCityAccount,
};
