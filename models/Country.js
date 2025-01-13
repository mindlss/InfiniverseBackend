const mongoose = require('mongoose');

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

    // Создаём новый город, привязываем его к текущей стране
    const newCity = new City({
        name: cityName,
        country: this._id,
    });

    await newCity.save();

    return newCity;
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

    // Проверяем, есть ли у страны уже валюта
    if (this.currency) {
        throw new Error('Country already has a currency.');
    }

    // Проверяем, не существует ли валюта с таким символом
    const existingCurrency = await Currency.findOne({ symbol });
    if (existingCurrency) {
        throw new Error('Currency with this symbol already exists.');
    }

    // Создаём новую валюту
    const newCurrency = new Currency({
        name,
        symbol,
        issuedBy: this._id, // Ссылка на страну, которая выпускает валюту
    });

    await newCurrency.save();

    // Привязываем валюту к стране
    this.currency = newCurrency._id;
    await this.save();

    // Создаём банковский счёт (казну) для страны с этой валютой
    const newAccount = new BankAccount({
        currency: newCurrency._id,  // Валюта страны
        accountType: 'country',  // Тип счёта — казна
        issuedBy: this._id,  // Ссылка на страну
    });

    await newAccount.save();

    return { currency: newCurrency, treasury: newAccount }; // Возвращаем валюту и казну
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

/**
 * Выпускает новый банковский счёт для пользователя в стране.
 * @param {mongoose.Schema.Types.ObjectId} userId - Идентификатор пользователя, которому принадлежит счёт.
 * @param {string} accountType - Тип счёта (например, 'debit', 'business').
 * @returns {Promise<Object>} - Возвращает объект нового банковского счёта.
 */
countrySchema.methods.issueBankAccount = async function (userId, accountType = 'debit') {
    const BankAccount = mongoose.model('BankAccount');

    // Создаём новый банковский счёт для пользователя в валюте страны
    const newAccount = new BankAccount({
        userId: userId,
        currency: this.currency, // Валюта страны
        accountType: accountType,
        issuedBy: this._id, // Ссылка на страну
    });

    await newAccount.save();

    return newAccount;
};

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;
