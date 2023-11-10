const User = require("../../Models/User");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");
const referralCodeGenerator = require("referral-code-generator");

const Schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  IdNumber: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  gender: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  managerPhone1: Joi.string().required(),
  managerPhone2: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const {
      Firstname,
      Lastname,
      AlternatePhone,
      PrimaryPhone,
      Gender,
      BankAccount,
      BankName,
      Address,
    } = req.body;

    const data = {
      firstName: Firstname,
      lastName: Lastname,
      phone: PrimaryPhone,
      altPhone: AlternatePhone,
      gender: Gender,
      billingAddress: Address,
      bankAccount: BankAccount,
      bankName: BankName,
    };

    console.log(data);

    const userFound = await User.findById(req.params.id);
    if (userFound) {
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        {
          firstName: Firstname,
          lastName: Lastname,
          phone: PrimaryPhone,
          altPhone: AlternatePhone,
          gender: Gender,
          billingAddress: Address,
          bankAccount: BankAccount,
          bankName: BankName,
        },
        {
          new: true,
        }
      );
      if (updated) {
        const updatedUser = await User.findById(req.params.id);
        const token = jwt.sign(
          { _id: updatedUser._id },
          constants.AGENT_TOKEN_SECRET,
          {
            expiresIn: constants.TOKEN_EXPIRATION_TIME,
          }
        );
        return res
          .status(200)
          .json({ status: "success", data: updatedUser, token });
      } else {
        return res.status(400).json("USER CANT UPDATE" + req.params.id);
      }
    } else {
      res.status(400).json("Invalid User ID" + req.params.id);
    }

    // }

    // return res.status(200).json({ status: "success", user });
  } catch (error) {
    next(error);
  }
};
