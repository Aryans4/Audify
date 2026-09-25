const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        })
        console.log("Database Connected")
    }
    catch(err) {
        console.log('database connection error:', err.message)
    }
}

module.exports = connectDB