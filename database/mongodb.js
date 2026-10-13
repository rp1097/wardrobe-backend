const mongoose = require("mongoose");
var CONFIG = require('../config/config');

//// LIVE
var URL = "mongodb+srv://ratneshkr1097:xhQ3FP1aTiS9UIqq@cluster0.ecdfnov.mongodb.net/"+CONFIG.DATABASE+"?retryWrites=true&w=majority" 

//// LOCAL
//var URL = 'mongodb://127.0.0.1:27017/'+CONFIG.DATABASE;


const connectDB = async () => {
  try {
    await mongoose.connect(URL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};


module.exports = connectDB;