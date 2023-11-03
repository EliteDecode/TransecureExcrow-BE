const bcrypt = require('bcryptjs');
const Admin = require('../../Models/adminSchema');
const jwt = require('jsonwebtoken');
const {REFRESH_TOKEN_SECRET, ADMIN_TOKEN_SECRET} = require('../../configs/constants');
// const {generateTokens} = require('../../middlewares/utills/generateTokens')



module.exports = async(req, res) => {
  try {
    const {password, email} = req.body
    const admin = await Admin.findOne({email})
    //console.log(admin.role)
    if(admin && (await bcrypt.compare(password,admin.password))){
      const generateAccessToken= jwt.sign({id:admin._id, role: admin.role},
        ADMIN_TOKEN_SECRET,
        {expiresIn: "14d"}) 

    const generateRefreshToken= jwt.sign({id:admin._id, role: admin.role},
        REFRESH_TOKEN_SECRET,
        {expiresIn: "30d"}) 


        return res.status(200).json({
          message: 'Admin Logged in successfully',
          id: admin._id,
          token: generateAccessToken,
          refreshToken: generateRefreshToken,
          admin
      })
    }else{
       return res.status(400).json({
        error: { message: "Invalid Login Credentials" },
        // message: 'invalid login credentials',
        })
    }
  } catch (err) {
      console.error(err.message)
       return res.status(500).json({
        message: err.message,
        })
  }
};
