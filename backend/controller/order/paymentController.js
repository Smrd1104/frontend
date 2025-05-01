const stripe = require("../../config/stripe");
const userModel = require("../../models/userModel");

const paymentController = async (request, response) => {
    try {
        const { cartItems } = request.body;

        // Validate required fields
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return response.status(400).json({
                message: "Cart items are required and must be a non-empty array",
                success: false
            });
        }






        // Check if user exists
        const user = await userModel.findOne({ _id: request.userId });
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                success: false
            });
        }


        const allowedOrigins = [
            "http://localhost:5173",
            "https://shop-e-mart.web.app",
            "https://shop-e-mart.onrender.com"
        ];

        const baseUrl = allowedOrigins.includes(request.headers.origin)
            ? request.headers.origin
            : allowedOrigins[0];

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
                userId: String(request.userId), // Ensure userId is a string
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
                    unit_amount: item.productId.sellingPrice * 100, // Amount in paise (INR)
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

        // Return the session ID for the client to redirect to Stripe Checkout
        response.status(200).json({
            success: true,
            id: session.id
        });

    } catch (err) {
        console.error("Payment error:", err);
        response.status(500).json({
            message: err.message || "Payment processing failed",
            success: false,
            error: true,
        });
    }
};

module.exports = { paymentController };
