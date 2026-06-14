require('dns').setDefaultResultOrder('ipv4first');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

console.log("Connecting to:", process.env.MONGO_URI ? "URI found" : "URI missing");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("SUCCESS: MongoDB Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR: Failed to connect to MongoDB:");
    console.error(err);
    process.exit(1);
  });
