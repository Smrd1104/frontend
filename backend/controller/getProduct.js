const productModel = require("../models/productModel")

async function getProductController(req, res) {
    try {

        const allProduct = await productModel.find().sort({ createdAt: -1 })

        res.json({
            message: "All Product",
            data: allProduct,
            error: false,
            success: true,
        })



    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = getProductController