const User = require("../../Models/User");
const Joi = require("joi");
const uploads = require("../../utils/uploads");

const Schema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  state: Joi.string().required(),
  area: Joi.string().required(),
  houseAddress: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const _id = req.user;
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }

    const user = await User.findOneAndUpdate(
      { _id },
      { $push: { addresses: value } },
      { new: true }
    );

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
