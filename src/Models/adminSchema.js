const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : true
    },
    lastName : {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique:  true
    },
    password : {
        type: String,
        required: true,
        // select: false
    },
    role:{
        type:String,
        default:"admin"
    }
 
},{
    timestamps: true
})
const Admin = mongoose.model('Admin', adminSchema)
// const enumRole= Admin.schema.path('role').enumValues
module.exports = Admin