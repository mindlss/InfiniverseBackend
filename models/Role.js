const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: false,
        },
        permissions: {
            type: Number,
            required: true,
            default: 0, // по умолчанию роль не имеет никаких прав
        },
        // Связь с городом или страной, к которому относится эта роль
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City',
            required: false,
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
            required: false,
        },
        // Список игроков, которым присвоена эта роль
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }]
    },
    {
        timestamps: true,
    }
);

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;