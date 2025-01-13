const mongoose = require('mongoose');
const City = require('../models/City');

const countrySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        leader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        currency: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Currency',
        },
        capital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City',
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Создаёт новый город и добавляет его в страну.
 * @param {string} cityName - Название города.
 * @returns {Promise<Object>} - Возвращает объект нового города.
 */
countrySchema.methods.createCity = async function (cityName) {
    const City = mongoose.model('City');

    const newCity = new City({
        name: cityName,
        country: this._id,
    });

    await newCity.save();

    var newCityAccount = null;

    if (this.currency) {
        newCityAccount = await newCity.createCityAccount(this.currency);
    }

    return { city: newCity, cityAccount: newCityAccount };
};

/**
 * Выпускает новую валюту для страны и создаёт казну.
 * @param {string} name - Название валюты.
 * @param {string} symbol - Символ валюты (должен быть уникальным).
 * @returns {Promise<Object>} - Возвращает объект новой валюты и казны (банковского счёта).
 * @throws {Error} - Если валюта с таким символом уже существует или у страны уже есть валюта.
 */
countrySchema.methods.issueCurrency = async function (name, symbol) {
    const Currency = mongoose.model('Currency');
    const BankAccount = mongoose.model('BankAccount');

    if (this.currency) {
        throw new Error('Country already has a currency.');
    }

    const existingCurrency = await Currency.findOne({ symbol });
    if (existingCurrency) {
        throw new Error('Currency with this symbol already exists.');
    }

    const newCurrency = new Currency({
        name,
        symbol,
        issuedBy: this._id,
    });

    await newCurrency.save();

    this.currency = newCurrency._id;
    await this.save();

    const newAccount = new BankAccount({
        currency: newCurrency._id,
        issuedBy: this._id,
        issuedByModel: 'Country',
    });

    await newAccount.save();

    const cities = await City.find({ country: this._id });

    const cityAccounts = [];
    for (const city of cities) {
        const cityAccount = await city.createCityAccount(newCurrency._id);
        cityAccounts.push(cityAccount);
    }

    return {
        currency: newCurrency,
        countryAccount: newAccount,
        cityAccounts: cityAccounts,
    };
};

/**
 * Устанавливает город в качестве столицы страны.
 * @param {mongoose.Schema.Types.ObjectId} cityId - Идентификатор города.
 * @returns {Promise<mongoose.Schema.Types.ObjectId>} - Возвращает ID установленной столицы.
 * @throws {Error} - Если город не найден или не принадлежит этой стране.
 */
countrySchema.methods.setCapital = async function (cityId) {
    const City = mongoose.model('City');

    const city = await City.findById(cityId);
    if (!city) {
        throw new Error('City not found.');
    }

    if (!city.country.equals(this._id)) {
        throw new Error('City does not belong to this country.');
    }

    this.capital = city._id;
    await this.save();

    return this.capital;
};

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;
