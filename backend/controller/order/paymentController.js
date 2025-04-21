const stripe = require("../../config/stripe");
const userModel = require("../../models/userModel");

const paymentController = async (request, response) => {
    try {
        const { cartItems } = request.body;

        const user = await userModel.findOne({ _id: request.userId });
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        const allowedOrigins = [
            "http://localhost:5173",         // local development
            "https://shop-e-mart.web.app",   // production frontend
            "https://shop-e-mart.onrender.com"
        ];

        // Choose the first allowed origin as the base for success and cancel
        const baseUrl = allowedOrigins.includes(request.headers.origin)
            ? request.headers.origin
            : allowedOrigins[0];  // fallback to the first allowed

        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ["card"],
            billing_address_collection: "auto",
            shipping_options: [
                { shipping_rate: "shr_1RFVSz4daNVaY89kXIMFhOE0" }
            ],
            customer_email: user.email,
            metadata: {
                userId: request.userId,
            },
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
            success_url: `${baseUrl}/success`,
            cancel_url: `${baseUrl}/cancel`,
        };

        const session = await stripe.checkout.sessions.create(params);

        // Send only the session ID
        response.status(200).json({ id: session.id });

    } catch (err) {
        response.status(500).json({
            message: err.message || err,
            success: false,
            error: true,
        });
    }
};

module.exports = { paymentController };
