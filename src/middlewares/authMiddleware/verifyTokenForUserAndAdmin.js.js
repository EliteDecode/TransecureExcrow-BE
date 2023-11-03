
const verifyTokenForUserAndAdmin = async(req,res,next ) => {
        if(req.admin.id === req.params.id || ['admin'].includes( req.admin.role)){
            next()
        }else{
            res.status(401).json({error:"You've not been authorized for this operation. Please contact admin"})
            
        }
}


module.exports= verifyTokenForUserAndAdmin


