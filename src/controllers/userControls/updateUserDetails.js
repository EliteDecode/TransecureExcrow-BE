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
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const _id = req.params.id;
    const { error, value } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    if (value.password !== value.confirmPassword) {
      return res.status(400).json({
        error: { message: "Password and Confirm Password Field must match" },
      });
    }
    value.password = await bcrypt.hash(value.password, 12);
    const user = await User.findOneAndUpdate({ _id }, value);

    // }

    return res.status(200).json({ status: "success", user });
  } catch (error) {
    next(error);
  }
};
