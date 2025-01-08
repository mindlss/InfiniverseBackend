const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
            type: [String],
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Перед сохранением хэшировать пароль, если он изменен
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Метод для проверки пароля
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
