const Organization =
require("../models/Organization");

const signup = async(req,res) => {

  try{

    const existing =
    await Organization.findOne({
      email:req.body.email
    });

    if(existing){

      return res.json({
        success:false,
        message:"Account already exists"
      });
    }

    const orphanage =
    new Organization(req.body);

    await orphanage.save();

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
};

const login = async(req,res) => {

  try{

    const orphanage =
    await Organization.findOne({
      email:req.body.email
    });

    if(!orphanage){

      return res.json({
        success:false,
        message:"Account not found"
      });
    }

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
};

module.exports = {
  signup,
  login
};