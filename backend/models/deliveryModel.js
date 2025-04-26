const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

deliveryModel.index(
    { userId: 1, address: 1, city: 1, state: 1, postalCode: 1 },
    { unique: true }
);


module.exports = mongoose.model('Delivery', deliverySchema);