const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: function () {
                return this.issuedByModel == 'User';
            },
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
            min: 0, // Минимальный баланс
        },
        currency: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Currency',
            required: true,
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        issuedByModel: {
            type: String,
            required: true,
            enum: ['User', 'Country', 'City', 'Party', 'Business'],
        },
    },
    {
        timestamps: true,
    }
);

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
module.exports = BankAccount;
