const router = require('express').Router()
const jwt = require('jsonwebtoken')
const {REFRESH_TOKEN_SECRET} = require('../configs/constants')
const refreshVerifyToken = require('../middlewares/authMiddleware/verifyRefreshToken')
const Admin = require('../Models/adminSchema')
//refresh token route
router.post('/:id/refreshToken', async(req,res)=>{
    const admin = await Admin.findById(req.params.id)
    if(admin){
    const Token = req.body.refreshToken
    const verifyToken = refreshVerifyToken
   
    if(verifyToken){
           const accessToken= jwt.sign({id:admin._id, role: admin.role},
            REFRESH_TOKEN_SECRET,
            {expiresIn: "365d"})

        return res.status(200).json({
            message: 'Refresh Access Token Generated',
            token: Token,
            tokenReset: accessToken
        })
    }else{
        res.status(400).json('invalid token')
    }
  }else{
    res.status(400).json('admin not found')
  }
})

module.exports = router