const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');

        // Now safely access the deliveries collection
        const db = mongoose.connection.db;
        await db.collection('deliveries').dropIndex('unique_address');
        console.log('✅ unique_address index dropped (if existed)');

    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);  // Exit to avoid silent failure
    }
}

module.exports = connectDB;
