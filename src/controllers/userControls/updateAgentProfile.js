const User = require("../../Models/User");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");
const referralCodeGenerator = require("referral-code-generator");

const Schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  gender: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const _id = req.params.id;
    console.log(_id)
    const { error, value } = Schema.validate(req.body);

    if (error) {
        console.log(error);
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const userFound = await User.findById(req.params.id)
    if(userFound){

        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            value);
            if(updatedUser) {
              return res.status(200).json({status: "success", data:updatedUser});

            } else {
              return res.status(400).json('USER CANT UPDATE'+req.params.id);      
            }

          }else{
        return res.status(400).json('User doesn\'t exists.');
    }

  } catch (error) {
    console.log(error);
    next(error);
  }
};
