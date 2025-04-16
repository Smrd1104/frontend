const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const cookieParser = require('cookie-parser')

const app = express()

const allowedOrigins = [
    "http://localhost:5173",         // local dev
    "https://shop-e-mart.web.app"    // production frontend
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.use(express.json())
app.use(cookieParser())
app.use("/api", router)

// Important change: Use process.env.PORT and bind to '0.0.0.0'
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Connected to DB`)
        console.log(`Server running on port ${PORT}`)
    })
})










// const express = require('express')
// const cors = require('cors')
// require('dotenv').config()
// const connectDB = require('./config/db')
// const router = require('./routes')
// const cookieParser = require('cookie-parser')


// const app = express()
// app.use(cors({
//     origin: "http://localhost:5173", // 👈 your frontend URL
//     credentials: true               // 👈 allow cookies/sessions
// }

// ))
// app.use(express.json())
// app.use(cookieParser())


// app.use("/api", router)

// const PORT = process.env.PORT || 8080;
// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log("connect DB")
//         console.log("server running")
//     })
// })
