require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const app = require("./app");
const connectDB = require("./db/db");

const port = Number(process.env.PORT) || 3000;

async function startServer() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required to start the API");
    }
    await connectDB();

    const server = app.listen(port, () => {
        console.log(`Audify API listening on port ${port}`);
    });

    const shutdown = () => {
        server.close(() => {
            process.exit(0);
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
    console.error("Failed to start Audify API:", error.message);
    process.exitCode = 1;
});
