const User = require("../../Models/User");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");

const Schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }

    const user = await User.findOne({ email: value.email }).select("+password");
    if (!user) {
      return res.status(400).json({
        error: { message: "Invalid email or password" },
      });
    }
    if(user){
      const isPassword = await bcrypt.compare(value.password, user.password);
      if (!isPassword) {
        return res.status(400).json({
          error: { message: "Invalid email or password" },
        });
      }
      if (user.role == "admin" || user.role == "agent") {
        console.log("User is an " + user.role)
      } else {
        return res.status(400).json({
          error: { message: "User is not an agent but a or an " + user.role },
        });
      } 
      const token = jwt.sign({ _id: user._id }, constants.AGENT_TOKEN_SECRET, {
        expiresIn: constants.TOKEN_EXPIRATION_TIME,
      });
      const refreshToken = jwt.sign(
        { _id: user._id },
        constants.REFRESH_TOKEN_SECRET,
        { expiresIn: "14d" }
      );
  
      return res.status(200).json({ token, refreshToken, user });

    }
  } catch (error) {
    next(error);
  }
};
