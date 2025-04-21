const stripe = require("../../config/stripe");
const orderModel = require("../../models/orderProductModel");

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

async function getLineItems(lineItems) {
    let productItems = [];

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await stripe.products.retrieve(item.price.product);
            const productId = product.metadata.productId;

            const productData = {
                productId: productId,
                name: product.name,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
                image: product.image,
            };

            productItems.push(productData);
        }
    }
    return productItems;
}

const webhooks = async (request, response) => {
    const signature = request.headers['stripe-signature'];
    const payloadString = JSON.stringify(request.body);

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            payloadString,
            signature,
            endpointSecret
        );
    } catch (err) {
        response.status(400).send(`Webhook error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Session:', session);
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

            const productDetails = await getLineItems(lineItems);
            const orderDetails = {
                productDetails: productDetails,
                email: session.customer_email,
                userId: session.metadata.userId,
                paymentDetails: {
                    paymentId: session.payment_intent,
                    payment_method_type: session.payment_method_types,
                    payment_status: session.payment_status,
                },
                shipping_options: session.shipping_options || [],  // Handle undefined shipping options
                totalAmount: session.amount_total / 100,
            };

            const order = new orderModel(orderDetails);

            try {
                const saveOrder = await order.save();  // Save the order to MongoDB
                console.log("Order saved:", saveOrder);
            } catch (error) {
                console.error("Error saving order:", error);  // Log any errors that occur while saving
                response.status(500).send("Internal Server Error");
                return;
            }

            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    response.status(200).send();  // Respond to Stripe that webhook was processed successfully
};

module.exports = webhooks;
