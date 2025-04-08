const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const cookieParser = require('cookie-parser')


const app = express()
app.use(cors({
    origin: "http://localhost:5173", // 👈 your frontend URL
    credentials: true               // 👈 allow cookies/sessions
}

))
app.use(express.json())
app.use(cookieParser())


app.use("/api", router)

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("connect DB")
        console.log("server running")
    })
})
