const rolesPermissions = {
    admin: ['create:post', 'edit:post', 'delete:post', 'view:post'],
    moderator: ['edit:post', 'view:post'],
    user: ['view:post'],
};

const getPermissionsForRole = (role) => {
    return rolesPermissions[role] || [];
};

module.exports = getPermissionsForRole;
