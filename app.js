/* eslint-disable no-undef */
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const connectDB = require('./config/db');
connectDB();

const passport = require('passport');
require('./config/passport');
app.use(passport.initialize());

app.use(express.json());

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
