const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const cookieParser = require('cookie-parser');

const app = express();

// CORS configuration
const allowedOrigins = [
    "http://localhost:5173",         // local dev
    "https://shop-e-mart.web.app",
    "https://shop-e-mart.onrender.com"    // production frontend
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

// Use the PORT environment variable provided by Render
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    console.log(`Server is trying to bind to port ${PORT}`);
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ MongoDB Connected`);
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
