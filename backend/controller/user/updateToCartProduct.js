const addToCartModel = require("../../models/cartProductModel")

const updateToCartProduct = async (req, res) => {
    try {

        const currentUserId = req.userId

        const addToCartProductId = req?.body?._id

        const qty = req.body.quantity

        const updateProduct = await addToCartModel.updateOne({
            _id:
                addToCartProductId
        }, {
            ...(qty && { quantity: qty })

        })


        res.json({
            message: "product updated",
            data: updateProduct,
            success: true,
            error: false,
        })
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = updateToCartProduct