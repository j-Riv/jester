function getCleanUser(user) {
    if (!user) return {};

    var u = user.toJSON();
    return {
        _id: u._id,
        email: u.email,
        username: u.username,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        image: u.image,
    }
}

module.exports = {
    getCleanUser: getCleanUser
}