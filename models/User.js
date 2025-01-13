const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: false,
        },
        email: {
            type: String,
            required: false,
            unique: false,
        },
        discordId: {
            type: String,
            required: true,
            unique: true,
        },
        roles: {
            type: [String],
            enum: ['admin', 'moderator', 'user'], // Возможные роли
            default: ['user'], // Роль по умолчанию
        },
        refreshToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
