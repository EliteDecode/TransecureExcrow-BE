const jwt  = require('jsonwebtoken')
const {TOKEN_SECRET} = require('../../configs/constants')

const verifyToken = async(req,res,next ) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //get token from header
            token = req.headers.authorization.split(' ')[1]

            //verify token
            const decoded_admin = jwt.verify(token, TOKEN_SECRET,(err,decoded)=>{
                if(err){
                    res.status(400).json('invalid token')
                }else{
                    req.admin =  decoded 
                    next()
                }
            })
        }catch(error){
            res.status(401).json(error.message) 
        }   
    }
    if(!token){
        res.status(401).json({message:"Access denied. No token for authorization"})
    }
}


module.exports= verifyToken


