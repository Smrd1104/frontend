const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const cookieParser = require('cookie-parser');

const app = express();

const allowedOrigins = [
    "http://localhost:5173",  // local dev
    "https://shop-e-mart.web.app",
    "https://shop-e-mart.onrender.com"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Allow credentials in response headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    console.log(`Server is trying to bind to port ${PORT}`);
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ MongoDB Connected`);
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
