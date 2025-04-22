const orderModel = require("../../models/orderProductModel")

const orderController = async (request, response) => {
    try {

        const currentUserId = request.userId

        const orderList = await orderModel.find({ userId: currentUserId }).sort({ createdAt: -1 })

        response.json({
            message: "order list",
            data: orderList,
            success: true,
            error: false,
        })
    } catch (err) {
        response.json({
            message: err.message || err,
            success: false,
            error: true,
        })
    }
}

module.exports = orderController