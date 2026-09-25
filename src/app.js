const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const musicRoutes = require("./routes/music.routes")

const app = express()

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/music", musicRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "Audify Backend API is running successfully!",
        frontendUrl: "http://localhost:5173",
        status: "online"
    })
})


module.exports=app