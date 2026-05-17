const mongoose = require("mongoose");

const ngoSchema =
new mongoose.Schema({

  ngoName:{
    type:String,
    required:true
  },

  personName:{
    type:String,
    required:true
  },

  phone:{
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
mongoose.model("NGO", ngoSchema);