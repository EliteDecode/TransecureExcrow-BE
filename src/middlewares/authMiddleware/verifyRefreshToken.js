const jwt  = require('jsonwebtoken')
const {REFRESH_TOKEN_SECRET} = require('../../configs/constants')

const refreshVerifyToken = async(req,res,next ) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //get token from header
            token = req.headers.authorization.split(' ')[1]

            //verify token
            const decoded_admin = jwt.verify(token, REFRESH_TOKEN_SECRET,(err,decoded)=>{
                if(err){
                    res.status(401).json('invalid token')
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


module.exports= refreshVerifyToken


// const verifyRefreshToken = (refreshToken) => {
//     userToken.findOne({token:refreshToken},(err,token)=>{
//         if(!token){
//             return res.status(400).json({error:{message: 'invalid refresh token'}})
//         }
//         const decoded_refreshToken = jwt.verify(token, TOKEN_SECRET,(err,decoded)=>{
//             if(err){
//                 res.status(400).json('invalid token')
//             }else{
//                 req.admin =  decoded 
//                 res.json(decoded)
//             }
//     })
//   }
// )}