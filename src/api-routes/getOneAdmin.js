const bcrypt = require('bcryptjs')
const Admin = require('../Models/adminSchema') 
const verifyTokenForUserAndAdmin = require('../middlewares/authMiddleware/verifyTokenForUserAndAdmin.js')
const verifyToken = require('../middlewares/authMiddleware/verifyAccessToken')
const router = require('express').Router()

router.get('/find/:id',verifyToken,verifyTokenForUserAndAdmin, async(req,res) => { 
    try {
        const admin = await Admin.findById(req.params.id)
    if(admin){
       return res.status(200).json(admin)
    }else{
        return res.status(400).json('admin not found')
    }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(err.message)
    }
})




module.exports = router