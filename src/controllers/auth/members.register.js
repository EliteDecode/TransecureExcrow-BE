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

    const isUser = await User.findOne({ email: value.email });
    if (isUser) {
      return res.status(400).json({
        error: { message: "A user is already registered with this email!" },
      });
    }
    else{
      value.password = await bcrypt.hash(value.password, 12);
      const user = await User.create({ ...value, role: "user" }); 
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
    // return res.status(200).json({ status: "success", user });
  } catch (error) {
    next(error);
  }
};
