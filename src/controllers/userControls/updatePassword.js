const User = require("../../Models/User");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");
const referralCodeGenerator = require("referral-code-generator");

const Schema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const _id = req.params.id;
    const { error, value } = Schema.validate(req.body);
    console.log(_id + value.oldPassword);
    const userFound = await User.findById(req.params.id).select('password');

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


    if (userFound) {
    console.log(userFound.password);
    const isPassword = await bcrypt.compare(value.oldPassword, userFound.password);

    if (!isPassword) {
        return res.status(400).json({
          error: { message: "Old Password is incorrect!" },
        });
    }

    value.newPassword = await bcrypt.hash(value.newPassword, 12);

    const user = await User.findOneAndUpdate({ _id }, { password: value.newPassword}); 
    return res.status(200).json({ status: "success", user });
      
  }

  } catch (error) {
    next(error);
  }
};
