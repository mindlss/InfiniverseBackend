/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../utils/authMiddleware');
const { rolesHasAny } = require('../utils/roleMiddleware');
const BankAccount = require('../models/BankAccount');

const countryService = require('../services/countryService');
const bankAccountService = require('../services/bankAccountService');

router.get('/testCountry', authenticateJWT, async (req, res) => {
    try {
        const countryData = {
            name: 'prikol',
            leader: req.user.id,
        };

        const newCountry = await countryService.createCountry(countryData);
        res.json(newCountry);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Ошибка' });
    }
});

router.get('/testCity', authenticateJWT, async (req, res) => {
    try {
        const country = await countryService.find('prikol');
        const newCity = await countryService.createCity(country.id, 'ebengrad2');

        res.json(newCity);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Ошибка' });
    }
});

router.get('/testCurrency', authenticateJWT, async (req, res) => {
    try {
        const country = await countryService.find('prikol');
        const newCurrency = await countryService.issueCurrency(country.id, 'denga', 'DNG');

        res.json(newCurrency);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Ошибка' });
    }
});

router.get('/testAccount', authenticateJWT, async (req, res) => {
    try {
        const country = await countryService.find('prikol');
        const newAccount = await bankAccountService.createBankAccount({
            issuedBy: country.id,
            issuedByModel: 'Country',
            currencyId: country.currency,
        });

        res.json(newAccount);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Ошибка' });
    }
});

router.get(
    '/accounts',
    authenticateJWT,
    rolesHasAny(['user']),
    async (req, res) => {
        try {
            const accounts = await BankAccount.find({ userId: req.user._id });
            res.json(accounts);
        } catch (err) {
            res.status(500).json({ error: 'Ошибка получения счетов' });
        }
    }
);

router.post(
    '/accounts',
    authenticateJWT,
    rolesHasAny(['user']),
    async (req, res) => {
        try {
            const newAccount = new BankAccount({
                userId: req.user._id,
                balance: 0,
            });
            await newAccount.save();
            res.status(201).json(newAccount);
        } catch (err) {
            res.status(400).json({ error: 'Ошибка создания счёта' });
        }
    }
);

// Получить конкретный счёт
router.get(
    '/accounts/:id',
    authenticateJWT,
    rolesHasAny(['user']),
    async (req, res) => {
        try {
            const account = await BankAccount.findOne({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!account) {
                return res.status(404).json({ error: 'Счёт не найден' });
            }
            res.json(account);
        } catch (err) {
            res.status(500).json({ error: 'Ошибка получения счёта' });
        }
    }
);

// Обновить баланс счета
router.patch(
    '/accounts/:id/balance',
    authenticateJWT,
    rolesHasAny(['user']),
    async (req, res) => {
        const { amount } = req.body;
        try {
            const account = await BankAccount.findOne({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!account) {
                return res.status(404).json({ error: 'Счёт не найден' });
            }
            await account.updateBalance(amount);
            res.json({ message: 'Баланс обновлен', balance: account.balance });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

// Деактивировать счёт
router.delete(
    '/accounts/:id',
    authenticateJWT,
    rolesHasAny(['user']),
    async (req, res) => {
        try {
            const account = await BankAccount.findOne({
                _id: req.params.id,
                userId: req.user._id,
            });
            if (!account) {
                return res.status(404).json({ error: 'Счёт не найден' });
            }
            account.isActive = false;
            await account.save();
            res.json({ message: 'Счёт деактивирован' });
        } catch (err) {
            res.status(500).json({ error: 'Ошибка деактивации счёта' });
        }
    }
);

module.exports = router;
