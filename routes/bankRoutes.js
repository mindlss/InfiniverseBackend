/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../utils/authMiddleware');
const { rolesHasAny } = require('../utils/roleMiddleware');
const BankAccount = require('../models/BankAccount');

router.get('/accounts', authenticateJWT, rolesHasAny(['user']), async (req, res) => {
    try {
        const accounts = await BankAccount.find({ userId: req.user._id });
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения счетов' });
    }
});

router.post(
    '/accounts',
    authenticateJWT,
    rolesHasAny(['user']), // Только пользователи с ролью 'user' могут создавать счёт
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
router.get('/accounts/:id', authenticateJWT, rolesHasAny(['user']), async (req, res) => {
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
});

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
