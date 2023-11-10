const User = require("../../Models/User");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");
const referralCodeGenerator = require("referral-code-generator");

module.exports = async function (req, res, next) {
  try {
    const _id = req.params.id;
    const userFound = await User.findById(req.params.id).select("password");

    const { password, oldPassword } = req.body;

    console.log(req.body);

    if (!password || !oldPassword) {
      return res.status(400).json({
        message: "All fields are compulsory",
      });
    }

    if (userFound) {
      const isPassword = await bcrypt.compare(oldPassword, userFound.password);

      if (!isPassword) {
        return res.status(400).json({
          error: { message: "Old Password is incorrect!" },
        });
      }

      const pwd = await bcrypt.hash(password, 12);

      const user = await User.findOneAndUpdate({ _id }, { password: pwd });
      return res.status(200).json({ status: "success", user });
    }
  } catch (error) {
    next(error);
  }
};
