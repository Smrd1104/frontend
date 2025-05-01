const mongoose = require('mongoose');

async function connectDB() {
    try {
        // Establish a connection to MongoDB using the URI from environment variables
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1); // Exit if connection fails
    }
}

module.exports = connectDB;
