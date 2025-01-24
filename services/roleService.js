const Role = require('../models/Role');
const { INTERACTION_PERMISSIONS, BUILDING_PERMISSIONS, USER_PERMISSIONS, COUNTRY_PERMISSIONS, CITY_PERMISSIONS, PARTY_PERMISSIONS } = require('../utils/permissions');

/**
 * Создание новой роли
 * @param {Object} data - Данные для создания роли
 * @returns {Promise<Object>} Возвращает созданную роль
 */
const createRole = async (data) => {
    const role = new Role(data);
    return await role.save();
};

/**
 * Добавить права к роли
 * @param {String} roleId - ID роли
 * @param {number} perms - Права для добавления
 * @returns {Promise<Object>} Обновленную роль
 */
const addPermissionsToRole = async (roleId, perms) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new Error('Роль не найдена');
    }

    role.permissions |= perms;
    return await role.save();
};

/**
 * Удалить права у роли
 * @param {String} roleId - ID роли
 * @param {number} perms - Права для удаления
 * @returns {Promise<Object>} Обновленную роль
 */
const removePermissionsFromRole = async (roleId, perms) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new Error('Роль не найдена');
    }

    role.permissions &= ~perms;
    return await role.save();
};

/**
 * Добавить пользователя в роль
 * @param {String} roleId - ID роли
 * @param {String} userId - ID пользователя
 * @returns {Promise<Object>} Обновленную роль
 */
const addUserToRole = async (roleId, userId) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new Error('Роль не найдена');
    }

    role.users.push(userId);
    return await role.save();
};

/**
 * Удалить пользователя из роли
 * @param {String} roleId - ID роли
 * @param {String} userId - ID пользователя
 * @returns {Promise<Object>} Обновленную роль
 */
const removeUserFromRole = async (roleId, userId) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new Error('Роль не найдена');
    }

    role.users = role.users.filter(users => users.toString() !== userId);
    return await role.save();
};

/**
 * Получить роль по ID
 * @param {String} roleId - ID роли
 * @returns {Promise<Object>} Данные роли
 */
const getRoleById = async (roleId) => {
    const role = await Role.findById(roleId).populate('users').populate('city').populate('country');
    if (!role) {
        throw new Error('Роль не найдена');
    }
    return role;
};

/**
 * Получить все роли
 * @returns {Promise<Array>} Список всех ролей
 */
const getAllRoles = async () => {
    return await Role.find().populate('users').populate('city').populate('country');
};

/**
 * Получить все доступные права
 * @returns {Object} Все доступные права
 */
const getAllPermissions = () => {
    return {
        INTERACTION_PERMISSIONS,
        BUILDING_PERMISSIONS,
        USER_PERMISSIONS,
        COUNTRY_PERMISSIONS,
        CITY_PERMISSIONS,
        PARTY_PERMISSIONS
    };
};

module.exports = {
    createRole,
    addPermissionsToRole,
    removePermissionsFromRole,
    addUserToRole,
    removeUserFromRole,
    getRoleById,
    getAllRoles,
    getAllPermissions,
};