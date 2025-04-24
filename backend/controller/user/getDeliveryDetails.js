const deliveryModel = require("../../models/deliveryModel");

const getDeliveryDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const addresses = await deliveryModel.find({ userId });

        if (!addresses || addresses.length === 0) {
            return res.status(404).json({
                message: "No delivery addresses found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Delivery addresses fetched successfully",
            data: addresses,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to fetch delivery addresses",
            success: false,
            error: true
        });
    }
};

module.exports = getDeliveryDetails;