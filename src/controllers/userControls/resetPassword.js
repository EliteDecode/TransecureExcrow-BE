const User = require("../../Models/User");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");
const referralCodeGenerator = require("referral-code-generator");

const Schema = Joi.object({
    email: Joi.string().email().required(),
});

module.exports = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    
    const userFound = await User.findOne({ email: value.email });
    if(userFound){
        const newPassword = await bcrypt.hash("123456", 12);
        const updatedUser = await User.findOneAndUpdate({ email:value.email }, { password: newPassword}); 

        if(updatedUser) {
            return res.status(200).json({status: "success"});

        }

    }

  } catch (error) {
    next(error);
  }
};
