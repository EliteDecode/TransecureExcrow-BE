const User = require("../../Models/User");
const Transaction = require("../../Models/Transaction");

const Joi = require("joi");

const Schema = Joi.object({
  amount: Joi.number().required(),
  transaction: Joi.object().required(),
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
    console.log(value);

    const user = await User.findOneAndUpdate(
      { _id },
      { $inc: { wallet: value.amount } },
      { new: true }
    );

    const preTransaction = new Transaction({
      amount: value.amount,
      userId: _id,
      reference: value.transaction,
    });
    const transaction = await preTransaction.save();

    return res.status(200).json({ user, transaction });
  } catch (err) {
    next(err);
  }
};
