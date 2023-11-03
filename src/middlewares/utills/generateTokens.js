// const res = require('express/lib/response')
const jwt = require('jsonwebtoken')
const {REFRESH_TOKEN_SECRET, TOKEN_SECRET} = require('../../configs/constants')
const generateTokens = (user)=>{
    try {
        const generateAccessToken= jwt.sign({id:user._id, role: user.role},
            TOKEN_SECRET,
            {expiresIn: "15m"}) 

        const generateRefreshToken= jwt.sign({id:user._id, role: user.role},
            REFRESH_TOKEN_SECRET,
            {expiresIn: "30d"}) 

       
    } catch (err) {
        res.status(500).json({error: {message: err.message}})
    }
}

module.exports = {generateTokens}