const User = require("../../Models/User");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");
const referralCodeGenerator = require("referral-code-generator");
const { sendMail } = require("../../utils/utils");

const Schema = Joi.object({
  email: Joi.string().email().required(),
});

function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

module.exports = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const pwd = generateRandomPassword(9);
    const userFound = await User.findOne({ email: value.email });
    if (userFound) {
      await sendMail(
        value.email,
        "Password Reset",
        `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
          <p style="font-weight: bold;">New Password:</p>
          <p>${pwd}</p>
          <p style="font-weight: bold;">Note:</p>
          <p>Please login to your account and pick a prefered password.</p>
       </div>`
      )
        .then(async () => {
          const newPassword = await bcrypt.hash(pwd, 12);
          const updatedUser = await User.findOneAndUpdate(
            { email: value.email },
            { password: newPassword }
          );
          if (updatedUser) {
            return res.status(200).json({ status: "success" });
          }
        })
        .catch((error) => {
          res.status(400).json("Verification Email could not be sent");
        });
    }
  } catch (error) {
    next(error);
  }
};
