const bankAccountService = require('../services/bankAccountService');

const getAccountByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const account = await bankAccountService.getAccountByUser(userId);
        res.json(account);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deposit = async (req, res) => {
    const { accountId, amount } = req.body;

    try {
        const newBalance = await bankAccountService.deposit(accountId, amount);
        res.json({ balance: newBalance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const withdraw = async (req, res) => {
    const { accountId, amount } = req.body;

    try {
        const newBalance = await bankAccountService.withdraw(accountId, amount);
        res.json({ balance: newBalance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllAccounts = async (req, res) => {
    try {
        const accounts = await bankAccountService.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAccountByUser, deposit, withdraw, getAllAccounts };
