const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");

async function deleteProductController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        const { _id } = req.body;

        if (!_id) {
            throw new Error("Product ID is required");
        }

        const deletedProduct = await productModel.findByIdAndDelete(_id);

        if (!deletedProduct) {
            throw new Error("Product not found or already deleted");
        }

        res.status(200).json({
            message: "Product deleted successfully",
            error: false,
            success: true,
            data: deletedProduct
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteProductController;
