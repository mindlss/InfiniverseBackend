const countryService = require('../services/countryService');

/**
 * Создаёт новую страну.
 * @param {Object} req - Объект запроса.
 * @param {Object} res - Объект ответа.
 */
async function createCountry(req, res) {
    try {
        const country = await countryService.createCountry(req.body);
        res.status(201).json(country);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/**
 * Создаёт новый город в указанной стране.
 * @param {Object} req - Объект запроса.
 * @param {Object} res - Объект ответа.
 */
async function createCity(req, res) {
    try {
        const { countryId } = req.params;
        const { cityName } = req.body;
        const result = await countryService.createCity(countryId, cityName);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/**
 * Выпускает валюту для страны.
 * @param {Object} req - Объект запроса.
 * @param {Object} res - Объект ответа.
 */
async function issueCurrency(req, res) {
    try {
        const { countryId } = req.params;
        const { name, symbol } = req.body;
        const result = await countryService.issueCurrency(countryId, name, symbol);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/**
 * Устанавливает город столицей страны.
 * @param {Object} req - Объект запроса.
 * @param {Object} res - Объект ответа.
 */
async function setCapital(req, res) {
    try {
        const { countryId } = req.params;
        const { cityId } = req.body;
        const country = await countryService.setCapital(countryId, cityId);
        res.status(200).json(country);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createCountry,
    createCity,
    issueCurrency,
    setCapital,
};
