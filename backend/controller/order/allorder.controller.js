const orderModel = require('../../models/orderProductModel');
const userModel = require('../../models/userModel');

const allOrderController = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
                error: true,
            });
        }

        // Allow only ADMIN users to view all orders
        if (user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Not authorized to access orders.",
                success: false,
                error: true,
            });
        }

        const allOrders = await orderModel.find().sort({ createdAt: -1 });

        return res.status(200).json({
            data: allOrders,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
};

module.exports = allOrderController;
