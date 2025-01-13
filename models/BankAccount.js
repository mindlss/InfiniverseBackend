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

/**
 * Метод для изменения баланса счета
 * @param {number} amount - Сумма для изменения баланса (положительное или отрицательное число).
 * @returns {Promise<number>} - Новый баланс после изменения.
 * @throws {Error} - Если средств недостаточно для вывода.
 */
bankAccountSchema.methods.updateBalance = async function (amount) {
    if (this.balance + amount < 0) {
        throw new Error('Insufficient funds');
    }
    this.balance += amount;
    await this.save();
    return this.balance;
};

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
module.exports = BankAccount;
