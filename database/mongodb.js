
const mongoose = require("mongoose");
const CONFIG = require("../config/config");


const user = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
const database = process.env.DB_NAME;

const URL = `mongodb+srv://${user}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;

const connectDB = async () => {
    console.log("Connecting to MongoDB...");
    try {
        await mongoose.connect(URL, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
};

module.exports = connectDB;
