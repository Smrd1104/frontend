const stripe = require("../../config/stripe");
const orderModel = require("../../models/orderProductModel");
const addToCartModel = require("../../models/cartProductModel")

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;

async function getLineItems(lineItems) {
    let productItems = [];

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await stripe.products.retrieve(item.price.product);
            const productId = product.metadata?.productId || '';

            const productData = {
                productId: productId,
                name: product.name,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
                image: product.images,
            };

            productItems.push(productData);
        }
    }
    return productItems;
}


const webhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        // Use the raw body directly - don't stringify it
        event = stripe.webhooks.constructEvent(
            request.body,  // This is already raw
            sig,
            endpointSecret
        );
    } catch (err) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`✅ Received event type: ${event.type}`);

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            // Verify payment was successful
            if (session.payment_status !== 'paid') {
                console.log('Payment not completed, skipping order creation');
                return response.status(200).send();
            }

            // Retrieve line items
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            const productDetails = await getLineItems(lineItems);

            const orderDetails = {
                productDetails: productDetails,
                email: session.customer_email,
                userId: session.metadata?.userId || '',
                paymentDetails: {
                    paymentId: session.payment_intent,
                    payment_method_type: session.payment_method_types,
                    payment_status: session.payment_status,
                },
                shipping_options: session.shipping_options.map(s => {
                    return {
                        ...s,
                        shipping_amount: s.shipping_amount / 100
                    }
                }),
                totalAmount: session.amount_total ? session.amount_total / 100 : 0,
            };

            console.log('💾 Saving order:', orderDetails);

            const order = new orderModel(orderDetails);
            const saveOrder = await order.save();

            if (saveOrder?._id) {
                const deleteCartItem = await addToCartModel.deleteMany({ userId: orderDetails.userId })
            }
            console.log('✅ Order saved successfully');

        } catch (error) {
            console.error('❌ Error processing order:', error);
            return response.status(500).send('Internal Server Error');
        }
    }

    response.status(200).send();
};

module.exports = webhooks;
