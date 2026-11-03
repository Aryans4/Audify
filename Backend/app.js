const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const musicRoutes = require("./routes/music.routes")

const app = express()
app.set("trust proxy", 1)
const frontendUrl = process.env.FRONTEND_URL || "https://audify-music.netlify.app"
const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://audify-music.netlify.app",
    new URL(frontendUrl).origin,
    ...(process.env.CORS_ORIGINS || "").split(",").map(origin => origin.trim()).filter(Boolean)
])

app.use(cors({
    origin(origin, callback) {
        callback(null, !origin || allowedOrigins.has(origin))
    },
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/music", musicRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "Audify Backend API is running successfully!",
        frontendUrl,
        status: "online"
    })
})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }
    console.error("API request failed:", error)
    return res.status(500).json({ message: "An unexpected server error occurred" })
})

module.exports=app