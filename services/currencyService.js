const Currency = require('../models/Currency');
const Country = require('../models/Country');

/**
 * Создаёт новую валюту.
 * @param {Object} data - Данные для создания валюты.
 * @returns {Promise<Object>} Возвращает созданную валюту.
 */
async function createCurrency(data) {
    const existingCurrency = await Currency.findOne({ symbol: data.symbol });
    if (existingCurrency) {
        throw new Error('Currency with this symbol already exists.');
    }

    const country = await Country.findById(data.issuedBy);
    if (!country) {
        throw new Error('Country not found.');
    }

    const currency = new Currency(data);
    return await currency.save();
}

/**
 * Получает страну, выпустившую указанную валюту.
 * @param {string} currencyId - ID валюты.
 * @returns {Promise<Object>} Возвращает страну, связанную с валютой.
 */
async function getCountryByCurrency(currencyId) {
    const currency = await Currency.findById(currencyId).populate('issuedBy');
    if (!currency) {
        throw new Error('Currency not found.');
    }

    const country = currency.issuedBy;
    if (!country) {
        throw new Error('Country not found for this currency.');
    }

    return country;
}

/**
 * Получает валюту по её ID.
 * @param {string} currencyId - ID валюты.
 * @returns {Promise<Object>} Возвращает объект валюты.
 */
async function getCurrencyById(currencyId) {
    const currency = await Currency.findById(currencyId);
    if (!currency) {
        throw new Error('Currency not found.');
    }
    return currency;
}

module.exports = {
    createCurrency,
    getCountryByCurrency,
    getCurrencyById,
};
