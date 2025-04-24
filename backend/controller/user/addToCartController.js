const addToCartModel = require("../../models/cartProductModel")

async function addToCartController(req, res) {
    try {
        const { productId } = req?.body
        const currentUser = req?.userId


        const isProductAvailable = await addToCartModel.findOne({ productId, userId: currentUser })

        if (isProductAvailable) {
            return res.json({
                message: "Already Exists in add to cart",
                success: false,
                error: true
            })
        }

        const payload = {
            productId: productId,
            quantity: 1,
            userId: currentUser,
        };

        const newAddToCart = new addToCartModel(payload);

        const SaveProduct = await newAddToCart.save(); // <-- FIXED

        // ✅ Only one response
        return res.json({
            message: "Product added",
            data: SaveProduct,
            error: false,
            success: true
        });


    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,

        })

    }
}

module.exports = addToCartController