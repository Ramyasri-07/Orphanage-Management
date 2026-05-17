const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  mobile:{
    type:String,
    required:true,
    unique:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  otp:{
    type:String,
    default:""
  },

  otpExpires:{
    type:Date,
    default:null
  }

});

module.exports =
mongoose.model("Donor", donorSchema);