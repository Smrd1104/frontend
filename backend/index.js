const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const webhooks = require('./controller/order/webhook');
const bodyParser = require('body-parser');
const app = express();

const allowedOrigins = [
    "http://localhost:5173",         // local development
    "https://shop-e-mart.web.app",   // production frontend
    "https://shop-e-mart.onrender.com"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Raw body parser for Stripe webhook route FIRST!
app.post('/api/webhook',
    express.raw({ type: 'application/json' }),
    webhooks
);

// Other middleware applies to all other routes
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    console.log(`✅ MongoDB Connected`);
    console.log(`🚀 Server running on port ${PORT}`);
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🌐 Listening at http://localhost:${PORT}`);
    });
});
