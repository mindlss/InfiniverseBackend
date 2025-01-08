/* eslint-disable no-undef */
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, permissions) => {
    return jwt.sign(
        { id: id, permissions: permissions },
        process.env.JWT_SECRET,
        {
            expiresIn: '3h',
        }
    );
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d',
    });
};

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
            scope: ['identify', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ discordId: profile.id });

                if (!user) {
                    user = await User.create({
                        username: profile.username,
                        email: profile.email,
                        discordId: profile.id,
                    });
                }

                const accessToken = generateAccessToken(
                    user.id,
                    user.permissions
                ); // Генерация Access Token
                const refreshToken = generateRefreshToken(user.id); // Генерация Refresh Token

                // Обновление `refreshToken` в базе
                user.refreshToken = refreshToken;
                await user.save();

                return done(null, {
                    user,
                    accessToken: accessToken,
                });
            } catch (error) {
                if (error.message && error.message.includes('rate limited')) {
                    // Если ошибка связана с rate limiting, возвращаем соответствующую ошибку
                    return done(null, false, {
                        message: 'Rate limit exceeded. Please try again later.',
                    });
                } else {
                    return done(error, null);
                }
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
