const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', // Ссылка на коллекцию пользователей
            required: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
            min: 0, // Минимальный баланс (например, нельзя уйти в минус)
        },
        accountType: {
            type: String,
            enum: ['savings', 'checking', 'investment'], // Типы счетов
            default: 'checking',
        },
        isFrozen: {
            type: Boolean,
            default: false, // Активен ли счет
        },
    },
    {
        timestamps: true, // Добавляет поля createdAt и updatedAt
    }
);

// Метод для изменения баланса
bankAccountSchema.methods.updateBalance = async function (amount) {
    if (this.balance + amount < 0) {
        throw new Error('Insufficient funds'); // Проверка на недостаток средств
    }
    this.balance += amount;
    await this.save();
    return this.balance;
};

const BankAccount = mongoose.model('Account', bankAccountSchema);
module.exports = BankAccount;
