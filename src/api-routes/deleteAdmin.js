const Admin = require('../Models/adminSchema') 
const verifyTokenForUserAndAdmin = require('../middlewares/authMiddleware/verifyTokenForUserAndAdmin.js')
const verifyToken = require('../middlewares/authMiddleware/verifyAccessToken')
const router = require('express').Router()


router.delete('/:id',verifyToken,verifyTokenForUserAndAdmin, async(req,res) => { 
    try {
            const adminFound = await Admin.findById(req.params.id)
             if(adminFound){
             await Admin.findByIdAndDelete(req.params.id)
             return res.status(200).json('admin deleted')
      }else{
        res.status(401).json('admin not found')
     }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error.message)
    }
})

module.exports = router