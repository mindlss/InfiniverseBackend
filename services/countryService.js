const Country = require('../models/Country');
const Currency = require('../models/Currency');

const cityService = require('./cityService');
const bankAccountService = require('./bankAccountService');

/**
 * Создаёт новую страну.
 * @param {Object} data - Данные для создания страны.
 * @returns {Promise<Object>} Возвращает созданную страну.
 */
async function createCountry(data) {
    const country = new Country(data);
    return await country.save();
}

/**
 * Создаёт новый город и добавляет его в страну.
 * @param {string} countryId - ID страны.
 * @param {string} cityName - Название города.
 * @returns {Promise<Object>} Возвращает созданный город и его банковский счёт.
 */
async function createCity(countryId, cityName) {
    const country = await Country.findById(countryId);
    if (!country) {
        throw new Error('Country not found.');
    }

    const newCity = await cityService.createCity({
        name: cityName,
        country: country._id,
    });

    let newCityAccount = null;
    if (country.currency) {
        newCityAccount = await cityService.createCityAccount(
            newCity._id,
            country.currency
        );
    }

    return { city: newCity, cityAccount: newCityAccount };
}

/**
 * Выпускает новую валюту для страны и создаёт казну.
 * @param {string} countryId - ID страны.
 * @param {string} name - Название валюты.
 * @param {string} symbol - Символ валюты.
 * @returns {Promise<Object>} Возвращает созданную валюту, казну и счета городов.
 */
async function issueCurrency(countryId, name, symbol) {
    const country = await Country.findById(countryId);
    if (!country) {
        throw new Error('Country not found.');
    }

    if (country.currency) {
        throw new Error('Country already has a currency.');
    }

    const existingCurrency = await Currency.findOne({ symbol });
    if (existingCurrency) {
        throw new Error('Currency with this symbol already exists.');
    }

    const newCurrency = new Currency({
        name,
        symbol,
        issuedBy: country._id,
    });

    await newCurrency.save();
    country.currency = newCurrency._id;
    await country.save();

    const newAccount = await bankAccountService.createBankAccount({
        issuedBy: country._id,
        issuedByModel: 'Country',
        currencyId: newCurrency._id,
    });

    const cities = await cityService.getCitiesByCountry(country._id);
    const cityAccounts = [];
    for (const city of cities) {
        const cityAccount = await bankAccountService.createBankAccount({
            issuedBy: city._id,
            issuedByModel: 'City',
            currencyId: newCurrency._id,
        });
        cityAccounts.push(cityAccount);
    }

    return {
        currency: newCurrency,
        countryAccount: newAccount,
        cityAccounts,
    };
}

/**
 * Устанавливает город в качестве столицы страны.
 * @param {string} countryId - ID страны.
 * @param {string} cityId - ID города.
 * @returns {Promise<Object>} Возвращает обновлённую страну.
 */
async function setCapital(countryId, cityId) {
    const country = await Country.findById(countryId);
    if (!country) {
        throw new Error('Country not found.');
    }

    const city = await cityService.getCityById(cityId);
    if (!city.country.equals(country._id)) {
        throw new Error('City does not belong to this country.');
    }

    country.capital = city._id;
    await country.save();

    return country;
}

/**
 * Ищет страну по уникальному параметру (_id или name).
 * @param {string} value - Значение для поиска.
 * @returns {Promise<Object>} Возвращает найденную страну.
 */
async function find(value) {
    // Попробуем найти страну по _id (проверка на валидный ObjectId)
    if (/^[0-9a-fA-F]{24}$/.test(value)) {
        return await Country.findById(value);
    }
    // Ищем страну по name
    return await Country.findOne({ name: value });
}

module.exports = {
    createCountry,
    createCity,
    issueCurrency,
    setCapital,
    find,
};
