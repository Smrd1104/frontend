const userModel = require("../models/userModel")

const uploadProductPermission = async (userId) => {
    const user = await userModel.findById(userId)

    if (!user) {
        // User not found
        return false;
    }

    if (user.role !== "ADMIN") {
        return false

    }
    return false
}

module.exports = uploadProductPermission