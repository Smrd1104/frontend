const stripe = require("../../config/stripe");
const userModel = require("../../models/userModel");

const paymentController = async (req, res) => {
    try {
        const { cartItems } = req.body;

        // Fetch the user from the database based on userId from the request
        const user = await userModel.findOne({ _id: req.userId });

        // Prepare the params for Stripe checkout session
        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ["card"],
            billing_address_collection: "auto",
            shipping_options: [
                {
                    shipping_rate: "shr_1RFVSz4daNVaY89kXIMFhOE0", // Ensure this shipping rate ID is valid
                }
            ],
            customer_email: user.email,
            line_items: cartItems.map((item) => {
                return {
                    price_data: {
                        currency: "INR",
                        product_data: {
                            name: item.productId.productName,
                            images: Array.isArray(item.productId.productImage)
                                ? item.productId.productImage // If it's already an array, use it
                                : [item.productId.productImage], // If it's a single string, make it an array
                            metadata: {
                                productId: item.productId._id
                            }
                        },
                        unit_amount: item.productId.sellingPrice * 100, // Ensure price is in paise (INR * 100)
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1,
                    },
                    quantity: item.quantity
                };
            }),
            success_url: "http://localhost:5173/success", // Ensure success URL is properly handled
            cancel_url: "http://localhost:5173/cancel",  // Consider adding a specific cancel URL
        };

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create(params);

        // Send the session data as a response
        res.status(303).json({
            data: session,
            message: "payment success",
            success: true,
            error: false,
        });

    } catch (err) {
        // Handle any errors that might occur during the process
        res.json({
            message: err.message || err,
            success: false,
            error: true,
        });
    }
};

module.exports = { paymentController };
