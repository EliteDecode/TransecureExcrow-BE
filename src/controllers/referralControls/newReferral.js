const Referrals = require("../../Models/Referrals");

const Joi = require("joi");

const Schema = Joi.object({
  referrer: Joi.string().required(),
  referred: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }

    const Referral = await Referrals.create({ ...value });

    return res.status(200).json({ status: "success", data: Referral });
  } catch (error) {
    next(error);
  }
};
