const User = require("../../Models/User");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");

const Schema = Joi.object({
  qrcode: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const _id = req.params.id;
    console.log(_id);
    const { error, value } = Schema.validate(req.body);

    if (error) {
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
        res.status(400).json('Invalid User ID'+req.params.id);
    }

    
    // return res.status(200).json({ status: "success", user });
  } catch (error) {
    next(error);
  }
};
