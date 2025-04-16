const productModel = require("../../models/productModel")

module.exports = async function (req, res) {
    try {

        const { category } = req?.body || req?.query
        console.log('category: ', category);

        const product = await productModel.find({ category })


        res.json({
            message: "product",
            data: product,
            error: false,
            success: true,
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}