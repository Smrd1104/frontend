const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');

        const db = mongoose.connection.db;
        const deliveriesCollection = db.collection('deliveries');

        const indexes = await deliveriesCollection.indexes();
        const indexNames = indexes.map(index => index.name);

        if (indexNames.includes('unique_address')) {
            await deliveriesCollection.dropIndex('unique_address');
            console.log('✅ unique_address index dropped');
        } else {
            console.log('ℹ️ unique_address index not found, skipping drop');
        }

    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1); // Exit to avoid silent failure
    }
}

module.exports = connectDB;
