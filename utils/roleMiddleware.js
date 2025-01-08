/* eslint-disable no-unused-vars */
const getPermissionsForRole = require('./roles');
const User = require('../models/User');

const rolesHasAny = (requiredRoles = []) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).select('roles');

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Пользователь не найден' });
            }

            const userRoles = user.roles;

            const hasRole = requiredRoles.some((role) =>
                userRoles.includes(role)
            );

            if (!hasRole) {
                return res.status(403).json({
                    message: 'Недостаточно прав для выполнения действия',
                });
            }

            next();
        } catch (err) {
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    };
};

const permissionsHasAll = (requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).select('roles');

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Пользователь не найден' });
            }

            const userRoles = user.roles;

            const userPermissions = userRoles.flatMap((role) =>
                getPermissionsForRole(role)
            );

            const hasPermissions = requiredPermissions.every((permission) =>
                userPermissions.includes(permission)
            );

            if (!hasPermissions) {
                return res.status(403).json({
                    message: 'Недостаточно прав для выполнения действия',
                });
            }

            next();
        } catch (err) {
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    };
};

module.exports = { permissionsHasAll, rolesHasAny };
