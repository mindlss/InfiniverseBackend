const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema(
    {
        token: { type: String, required: true },
        addedAt: { type: Date, required: true },
    },
    { timestamps: true }
);

blacklistedTokenSchema.index(
    { addedAt: 1 },
    { expireAfterSeconds: 3 * 60 * 60 }
); // удаление через 3 часа

const BlacklistedToken = mongoose.model(
    'BlacklistedToken',
    blacklistedTokenSchema
);

module.exports = BlacklistedToken;
