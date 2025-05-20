const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    title: { type: String, required: false },
    media: [
        {
            type: { type: String, enum: ['image', 'video'], required: true },
            url: { type: String, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ad', AdSchema);
