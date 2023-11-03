const User = require("../../Models/User");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");
const referralCodeGenerator = require("referral-code-generator");

const Schema = Joi.object({
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const email = req.params.email;
    const tkn = req.params.tkn;
    const { error, value } = Schema.validate(req.body);
    
    
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }

    if (value.newPassword !== value.confirmPassword) {
      return res.status(400).json({
        error: { message: "Password and Confirm Password Field must match " },
      });
    }
    
    const userFound = await User.findOne({ email });

    if (userFound) {
    
    value.newPassword = await bcrypt.hash(value.newPassword, 12);

    const user = await User.findOneAndUpdate({ email }, { password: value.newPassword}); 
    if (user) {
      return res.status(200).json({ status: "success" });
    }
      
  }

  } catch (error) {
    next(error);
  }
};
