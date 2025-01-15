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

const Currency = mongoose.model('Currency', currencySchema);
module.exports = Currency;
