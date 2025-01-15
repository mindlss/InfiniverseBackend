const cityService = require('../services/cityService');

/**
 * Получить данные города по ID
 */
const getCity = async (req, res) => {
    try {
        const city = await cityService.getCityById(req.params.id);
        res.json(city);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Получить список всех городов
 */
const getAllCities = async (req, res) => {
    try {
        const cities = await cityService.getAllCities();
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Создать новый город
 */
const createCity = async (req, res) => {
    try {
        const city = await cityService.createCity(req.body);
        res.status(201).json(city);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Обновить данные города
 */
const updateCity = async (req, res) => {
    try {
        const city = await cityService.updateCity(req.params.id, req.body);
        res.json(city);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Удалить город
 */
const deleteCity = async (req, res) => {
    try {
        const city = await cityService.deleteCity(req.params.id);
        res.json({ message: 'Город успешно удалён', city });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/**
 * Создать банковский счёт для города
 */
const createCityAccount = async (req, res) => {
    try {
        const account = await cityService.createCityAccount(req.params.id, req.body.currencyId);
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCity,
    getAllCities,
    createCity,
    updateCity,
    deleteCity,
    createCityAccount,
};
