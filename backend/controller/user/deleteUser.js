const userModel = require("../../models/userModel");

async function deleteUser(req, res) {
    try {
        const userId = req.params.id;

        // Check if user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        // Delete the user
        await userModel.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User deleted successfully",
            error: false,
            success: true,
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = deleteUser;
