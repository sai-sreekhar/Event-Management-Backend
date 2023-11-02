const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      maxPoolSize: 100,
      minPoolSize: 2,
    });
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = { connectToDatabase };
