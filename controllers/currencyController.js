const currencyService = require('../services/currencyService');

/**
 * Создаёт новую валюту.
 * @param {Object} req - Объект запроса.
 * @param {Object} res - Объект ответа.
 */
async function createCurrency(req, res) {
    try {
        const currency = await currencyService.createCurrency(req.body);
        res.status(201).json(currency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/**
 * Получает страну, выпустившую указанную валюту.
 * @param {Object} req - Объект запроса.
 * @param {Object} res - Объект ответа.
 */
async function getCountryByCurrency(req, res) {
    try {
        const { currencyId } = req.params;
        const country = await currencyService.getCountryByCurrency(currencyId);
        res.status(200).json(country);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/**
 * Получает валюту по её ID.
 * @param {Object} req - Объект запроса.
 * @param {Object} res - Объект ответа.
 */
async function getCurrencyById(req, res) {
    try {
        const { currencyId } = req.params;
        const currency = await currencyService.getCurrencyById(currencyId);
        res.status(200).json(currency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createCurrency,
    getCountryByCurrency,
    getCurrencyById,
};
