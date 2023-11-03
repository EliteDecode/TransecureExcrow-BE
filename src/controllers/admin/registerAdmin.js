const bcrypt = require('bcryptjs');
const Admin = require('../../Models/adminSchema');


module.exports = async(req, res) => {
    
    try {
        const adminExist = await Admin.findOne({email: req.body.email})
            if(!adminExist){
            const salt = await bcrypt.genSalt(10)
            const hashedpassword = await  bcrypt.hash(req.body.password,salt)

            let {role,firstName, lastName, email, password, confirmPassword } = req.body;

            if (!email || !firstName || !lastName || !password || !confirmPassword) {
                return res.status(400).json({
                error: {message: "all fields are required"},
        })}
            if (password !== confirmPassword) {
                 return res.status(400).json({
                 error: { message: "password and confirm password fields must match" },
         })}

        

        const newAdmin = await new Admin({
            
                firstName,
                lastName,
                email,
                role,
                password: hashedpassword
       })  
       

        await newAdmin.save()
        if(newAdmin){
            const {password, ...others} = newAdmin._doc
            res.status(201).json({message:'Successful Registration', others})
        }    
        }else{
            res.status(401).json({error: {message:'Unsuccessful registration, email already exist.'},})
        }    


    } catch (err) {
        console.log(err.message)
        res.status(501).json({error:err.message})
    }       
        
}