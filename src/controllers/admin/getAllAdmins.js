const Admin = require('../../Models/adminSchema') 
const verifyTokenForAdmin = require('../../middlewares/authMiddleware/verifyTokenForAdmin')
const verifyToken = require('../../middlewares/authMiddleware/verifyAccessToken')



module.exports = async(req,res) => { 
    try {
        const admin = await Admin.find()
        if(admin){
            return res.status(200).json({data:admin})
    }else{
        return res.status(400).json('admin not found')
    }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error.message)
    }
}



