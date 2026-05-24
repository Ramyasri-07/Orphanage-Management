const mongoose = require("mongoose");

const needSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  targetAmount: Number,
  deadline: String
});

const organizationSchema = new mongoose.Schema({
  orphanageName: String,
  personName: String,
  phone: String,
  email: String,
  password: String,
  AccNo: String,
  needs: [needSchema],

  // ✅ ADD THESE (THIS IS THE FIX)
  otp: Number,
  otpExpiry: Number
});

module.exports = mongoose.model("Organization", organizationSchema);