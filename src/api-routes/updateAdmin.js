const bcrypt = require('bcryptjs')
const Admin = require('../Models/adminSchema') 
const verifyTokenForUserAndAdmin = require('../middlewares/authMiddleware/verifyTokenForUserAndAdmin.js')
const verifyToken = require('../middlewares/authMiddleware/verifyAccessToken')
const router = require('express').Router()


router.put('/:id',verifyToken,verifyTokenForUserAndAdmin, async(req,res) => { 
    try {
        const adminFound = await Admin.findById(req.params.id)
        if(adminFound){

        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
             req.body.password = await bcrypt.hash(req.body.password,salt) 

            const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id,
                {
                    $set: req.body
                },
                { new:true})
        
                return res.status(200).json(updatedAdmin)
        }

        }else{
            res.status(400).json('admin not found. invalid admin id')
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error.message)
    }
})



module.exports = router