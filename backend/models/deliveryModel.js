const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, required: true, lowercase: true, trim: true },
    state: { type: String, required: true, lowercase: true, trim: true },
    postalCode: { type: String, default: null, trim: true }, // Default to null if not provided
    phone: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});

// Create index on userId, address, city, state, postalCode for uniqueness
deliverySchema.index({ userId: 1, address: 1, city: 1, state: 1, postalCode: 1 }, { unique: true });

module.exports = mongoose.model("Delivery", deliverySchema);
