const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    name: { type: String, required: true },
    symbol: { type: String, unique: true, required: true },
    createdAt: { type: Date, default: Date.now },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId, // Ссылка на страну
        ref: 'Country', // Название модели Country
        required: true, // Обязательно для каждого счета
    },
});

// Метод для получения страны, связанной с валютой
currencySchema.methods.getCountry = async function () {
    const Country = mongoose.model('Country');
    const country = await Country.findById(this.creator);
    if (!country) {
        throw new Error('Country not found for this currency.');
    }
    return country;
};

const Currency = mongoose.model('Currency', currencySchema);
module.exports = Currency;
