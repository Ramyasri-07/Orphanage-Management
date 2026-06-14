const express = require("express");
const router = express.Router();
const nodemailer =
require("nodemailer");
const Donor =require("../models/Donor");
//to send mail for authentication
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
    const existingEmail =await Donor.findOne({
      email:req.body.email
    });
    if(existingEmail){
      return res.json({
        success:false,
        message:"Email already exists"
      });
    }

    const existingMobile =
    await Donor.findOne({
      mobile:req.body.mobile
    });

    if(existingMobile){

      return res.json({
        success:false,
        message:"Mobile already exists"
      });
    }

    const donor =new Donor(req.body);
     await donor.save();
     await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to:donor.email,
      subject:"Welcome to HopeBridge",
      text:"You have successfully signed up as Donor"
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
//sending otp
router.post("/send-otp", async(req,res)=>{
  try{
    const donor =await Donor.findOne({
      $or:[
        {email:req.body.login},
        {mobile:req.body.login}
      ]
    });
    if(!donor){
      return res.json({
        success:false,
        message:"Account not found"
      });
    }
    const otp =Math.floor(
      100000 + Math.random()*900000
    ).toString();
    donor.otp = otp;
    donor.otpExpires =
    new Date(
      Date.now() + 2*60*1000
    );
    await donor.save();
    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to:donor.email,
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
    const donor =await Donor.findOne({
      $or:[
        {email:req.body.login},
        {mobile:req.body.login}
      ]
    });
    if(!donor){
      return res.json({
        success:false,
        message:"Account not found"
      });
    }
    if(donor.otpExpires <new Date()){
      return res.json({
        success:false,
        message:"OTP Expired"
      });
    }

    if(donor.otp !== req.body.otp){
      return res.json({
        success:false,
        message:"Invalid OTP"
      });
    }
    donor.otp = "";
    donor.otpExpires = null;
    await donor.save();
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