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

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;
