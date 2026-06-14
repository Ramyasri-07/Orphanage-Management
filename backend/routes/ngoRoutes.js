const express = require("express");

const router = express.Router();

const nodemailer =
require("nodemailer");

const NGO =
require("../models/NGO");

const transporter =
nodemailer.createTransport({

  service:"gmail",

  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  }
});



router.post("/signup", async(req,res)=>{

  try{

    const existingEmail =
    await NGO.findOne({
      email:req.body.email
    });

    if(existingEmail){

      return res.json({
        success:false,
        message:"Email already exists"
      });
    }

    const existingPhone =
    await NGO.findOne({
      phone:req.body.phone
    });

    if(existingPhone){

      return res.json({
        success:false,
        message:"Phone already exists"
      });
    }

    const ngo =
    new NGO(req.body);

    await ngo.save();

    await transporter.sendMail({

      from:process.env.EMAIL_USER,

      to:ngo.email,

      subject:"Welcome to HopeBridge",

      text:"You have successfully signed up as NGO"
    });

    res.json({
      success:true,
      message:"Signup Successful"
    });

  }catch(error){

    res.json({
      success:false,
      message:error.message
    });
  }
});



router.post("/send-otp", async(req,res)=>{

  try{

    const ngo =
    await NGO.findOne({

      $or:[
        {email:req.body.login},
        {phone:req.body.login}
      ]
    });

    if(!ngo){

      return res.json({
        success:false,
        message:"Account not found"
      });
    }

    const otp =
    Math.floor(
      100000 + Math.random()*900000
    ).toString();

    ngo.otp = otp;

    ngo.otpExpires =
    new Date(
      Date.now() + 2*60*1000
    );

    await ngo.save();

    await transporter.sendMail({

      from:process.env.EMAIL_USER,

      to:ngo.email,

      subject:"HopeBridge OTP",

      text:`Your OTP is ${otp}. Valid for 2 minutes`
    });

    res.json({
      success:true,
      message:"OTP Sent"
    });

  }catch(error){

    res.json({
      success:false,
      message:error.message
    });
  }
});



router.post("/verify-otp", async(req,res)=>{

  try{

    const ngo =
    await NGO.findOne({

      $or:[
        {email:req.body.login},
        {phone:req.body.login}
      ]
    });

    if(!ngo){

      return res.json({
        success:false,
        message:"Account not found"
      });
    }

    if(
      ngo.otpExpires <
      new Date()
    ){

      return res.json({
        success:false,
        message:"OTP Expired"
      });
    }

    if(
      ngo.otp !== req.body.otp
    ){

      return res.json({
        success:false,
        message:"Invalid OTP"
      });
    }

    ngo.otp = "";

    ngo.otpExpires = null;

    await ngo.save();

    res.json({
      success:true,
      message:"Login Successful"
    });

  }catch(error){

    res.json({
      success:false,
      message:error.message
    });
  }
});

module.exports = router;