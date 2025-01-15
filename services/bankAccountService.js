const BankAccount = require('../models/BankAccount');
const Currency = require('../models/Currency');

/**
 * Создаёт новый банковский счет.
 * @param {Object} data - Данные для создания счета.
 * @param {mongoose.Types.ObjectId} data.issuedBy - ID того, кто выпускает счет (например, страна или пользователь).
 * @param {String} data.issuedByModel - Модель того, кто выпускает счет (например, 'User', 'Country', 'City').
 * @param {mongoose.Types.ObjectId} data.currencyId - ID валюты для счета.
 * @param {Number} [data.balance=0] - Начальный баланс счета (по умолчанию 0).
 * @returns {Promise<Object>} Возвращает созданный банковский счет.
 */
const createBankAccount = async ({ issuedBy, issuedByModel, currencyId, balance = 0 }) => {
    console.log({currencyId: currencyId});
    // Проверяем, существует ли валюта
    const currency = await Currency.findById(currencyId);
    if (!currency) {
        throw new Error('Валюта не найдена');
    }

    // Создаём новый счет
    const newAccount = new BankAccount({
        issuedBy,
        issuedByModel,
        currency: currency._id,
        balance,
    });

    await newAccount.save();
    return newAccount;
};

/**
 * Получить счет пользователя по ID
 * @param {String} userId - ID пользователя
 * @returns {Promise<Object>} Данные счета
 */
const getAccountByUser = async (userId) => {
    const account = await BankAccount.findOne({ userId }).populate('currency');
    if (!account) {
        throw new Error('Счет не найден');
    }
    return account;
};

/**
 * Пополнить баланс счета
 * @param {String} accountId - ID счета
 * @param {Number} amount - Сумма для пополнения
 * @returns {Promise<Number>} Новый баланс
 */
const deposit = async (accountId, amount) => {
    if (amount <= 0) {
        throw new Error('Сумма должна быть положительной');
    }

    const account = await BankAccount.findById(accountId);
    if (!account) {
        throw new Error('Счет не найден');
    }

    account.balance += amount;
    await account.save();
    return account.balance;
};

/**
 * Снять средства со счета
 * @param {String} accountId - ID счета
 * @param {Number} amount - Сумма для снятия
 * @returns {Promise<Number>} Новый баланс
 */
const withdraw = async (accountId, amount) => {
    if (amount <= 0) {
        throw new Error('Сумма должна быть положительной');
    }

    const account = await BankAccount.findById(accountId);
    if (!account) {
        throw new Error('Счет не найден');
    }

    if (account.balance < amount) {
        throw new Error('Недостаточно средств');
    }

    account.balance -= amount;
    await account.save();
    return account.balance;
};

/**
 * Получить все счета
 * @returns {Promise<Array>} Список счетов
 */
const getAllAccounts = async () => {
    const accounts = await BankAccount.find().populate('currency');
    return accounts;
};

module.exports = { createBankAccount, getAccountByUser, deposit, withdraw, getAllAccounts };
