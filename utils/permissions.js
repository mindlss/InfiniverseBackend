// Права взаимодействия
const INTERACTION_PERMISSIONS = {
    BUTTONS: 1 << 0,        // Нажатие кнопок
    LEVERS: 1 << 1,         // Переключение рычагов
    PLATES: 1 << 2,         // Нажимные плиты
    DOORS: 1 << 3,          // Двери
    CHESTS: 1 << 4,         // Сундуки
    ANVILS: 1 << 5,         // Наковальни
    WORKBENCHES: 1 << 6,    // Верстаки
    FURNACES: 1 << 7,       // Печи
    BEDS: 1 << 8            // Кровати
};

// Права строительства
const BUILDING_PERMISSIONS = {
    PLACE_BLOCKS: 1 << 0,   // Установка блоков
    DESTROY_BLOCKS: 1 << 1, // Ломание блоков
    USE_FLINT: 1 << 2,      // Использование кремня
    BUILD_REDSTONE: 1 << 3, // Постройка редстоуна
    BUILD_PORTALS: 1 << 4   // Строительство порталов
};

// Права игроков
const USER_PERMISSIONS = {
    KILL_MOBS: 1 << 0,      // Убийство мобов
    PVP: 1 << 1,            // PvP
    LOOT: 1 << 2            // Лут предметов с пола
};

// Права управления страной
const COUNTRY_PERMISSIONS = {
    MANAGE_USERS: 1 << 0, // Управление игроками
    MANAGE_ROLES: 1 << 1,   // Управление ролями
    MANAGE_CITIES: 1 << 2,  // Управление городами
};

// Права управления городом
const CITY_PERMISSIONS = {
    MANAGE_USERS: 1 << 0, // Управление игроками
    MANAGE_ROLES: 1 << 1,   // Управление ролями
    MANAGE_REGIONS: 1 << 2, // Управление приватами
    SPAWN_MOBS: 1 << 3,     // Спавн мобов
};

// Права партии
const PARTY_PERMISSIONS = {
    MANAGE_ROLES: 1 << 0,    // Управление ролями
    INVITE_USERS: 1 << 1, // Приглашать игроков
    KICK_USERS: 1 << 2,   // Выгонять игроков
};

// Комбинирование разрешений
const combinePermissions = (...perms) => {
    return perms.reduce((acc, perm) => acc | perm, 0);
};

// Проверка, содержит ли набор разрешений указанное
const hasPermission = (userPerms, requiredPerm) => {
    return (userPerms & requiredPerm) === requiredPerm;
};

module.exports = {
    INTERACTION_PERMISSIONS,
    BUILDING_PERMISSIONS,
    USER_PERMISSIONS,
    COUNTRY_PERMISSIONS,
    CITY_PERMISSIONS,
    PARTY_PERMISSIONS,
    combinePermissions,
    hasPermission,
};
