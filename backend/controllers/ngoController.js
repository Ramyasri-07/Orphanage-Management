const NGO =
require("../models/NGO");

const signup = async(req,res) => {

  try{

    const existing =
    await NGO.findOne({
      email:req.body.email
    });

    if(existing){

      return res.json({
        success:false,
        message:"Account already exists"
      });
    }

    const ngo =
    new NGO(req.body);

    await ngo.save();

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

    const ngo =
    await NGO.findOne({
      email:req.body.email
    });

    if(!ngo){

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