const express = require('express');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

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
const bankRoutes = require('./routes/bankRoutes');
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/bank', bankRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Backend is up and running on http://localhost:${PORT}`);
});
