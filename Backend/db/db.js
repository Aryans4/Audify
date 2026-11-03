const mongoose = require("mongoose")

async function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is required to connect to MongoDB");
    }

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
    });
    console.log("Database connected");
}

module.exports = connectDB