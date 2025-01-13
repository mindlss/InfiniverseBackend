const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Создаёт банковский счёт для города.
 * @returns {Promise<Object>} - Возвращает объект нового банковского счёта.
 * @throws {Error} - Если у города уже есть банковский счёт данного типа.
 */
citySchema.methods.createCityAccount = async function (currency = null) {
    const BankAccount = mongoose.model('BankAccount');

    const existingAccount = await BankAccount.findOne({
        issuedBy: this._id,
    });

    if (existingAccount) {
        throw new Error(
            `Bank account of type town already exists for this city.`
        );
    }

    console.log(this.country);

    const newAccount = new BankAccount({
        currency: currency || this.country.currency,
        issuedBy: this._id,
        issuedByModel: 'City',
    });

    await newAccount.save();

    return newAccount;
};

/**
 * Модель City представляет города в системе.
 *
 * Поля:
 * - `name` (String): Название города, уникальное для базы данных.
 * - `country` (ObjectId): Ссылка на страну (Country), к которой принадлежит город.
 * - `createdAt` (Date): Дата создания города (автоматически добавляется Mongoose).
 * - `updatedAt` (Date): Дата последнего обновления города (автоматически добавляется Mongoose).
 */

const City = mongoose.model('City', citySchema);
module.exports = City;
