const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
const Organization = require("../models/Organization");

// ---------------- EMAIL SETUP ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4
});

transporter.verify((error, success) => {
  if (error) {
    console.log("MAIL ERROR:", error);
  } else {
    console.log("MAIL SERVER READY");
  }
});

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  try {

    const existingEmail = await Organization.findOne({
      email: req.body.email
    });

    if (existingEmail) {
      return res.json({
        success: false,
        message: "Email already exists"
      });
    }

    const existingPhone = await Organization.findOne({
      phone: req.body.phone
    });

    if (existingPhone) {
      return res.json({
        success: false,
        message: "Phone already exists"
      });
    }

    const organization = new Organization(req.body);

    await organization.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: organization.email,
      subject: "Welcome to HopeBridge",
      text: "You have successfully signed up as Orphanage"
    });

    res.json({
      success: true,
      message: "Signup Successful"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ---------------- SEND OTP ----------------
router.post("/send-otp", async (req, res) => {
  try {

    const { login } = req.body;

    const user = await Organization.findOne({
      $or: [{ email: login }, { phone: login }]
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpiry = Date.now() + 2 * 60 * 1000; // 2 minutes

    await user.save();

    // OPTIONAL EMAIL OTP (uncomment if needed)
    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: user.email,
    //   subject: "OTP for Login",
    //   text: `Your OTP is ${otp}. It is valid for 2 minutes.`
    // });

    console.log("OTP SENT:", otp);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", async (req, res) => {
  try {

    const { login, otp } = req.body;

    const user = await Organization.findOne({
      $or: [{ email: login }, { phone: login }]
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.otp) {
      return res.json({
        success: false,
        message: "OTP not generated"
      });
    }

    if (Date.now() > user.otpExpiry) {
      return res.json({
        success: false,
        message: "OTP expired"
      });
    }

    if (Number(user.otp) !== Number(otp)) {
      return res.json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // clear OTP after success
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;