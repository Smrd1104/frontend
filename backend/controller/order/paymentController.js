const stripe = require("../../config/stripe");
const userModel = require("../../models/userModel");

const paymentController = async (req, res) => {
    try {
        const { cartItems } = req.body;

        const user = await userModel.findOne({ _id: req.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ["card"],
            billing_address_collection: "auto",
            shipping_options: [
                { shipping_rate: "shr_1RFVSz4daNVaY89kXIMFhOE0" }
            ],
            customer_email: user.email,
            line_items: cartItems.map(item => ({
                price_data: {
                    currency: "INR",
                    product_data: {
                        name: item.productId.productName,
                        images: Array.isArray(item.productId.productImage)
                            ? item.productId.productImage
                            : [item.productId.productImage],
                        metadata: { productId: item.productId._id }
                    },
                    unit_amount: item.productId.sellingPrice * 100,
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                },
                quantity: item.quantity
            })),
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        };

        const session = await stripe.checkout.sessions.create(params);

        // Send only the session ID
        res.status(200).json({ id: session.id });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            success: false,
            error: true,
        });
    }
};

module.exports = { paymentController };
