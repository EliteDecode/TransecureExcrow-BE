const Transaction = require("../../Models/Transaction");

const Joi = require("joi");

const Schema = Joi.object({
  title: Joi.string().required(),
  userId: Joi.string().required(),
  amount: Joi.number().required(),
  escrowFee: Joi.number().required(),
  shippingFee: Joi.number().required(),
  escrowCharge: Joi.string().required(),
  shippingCharge: Joi.string().required(),
  currency: Joi.string().required(),
  senderEmail: Joi.string().email().required(),
  senderRole: Joi.string().required(),
  beneficiaryEmail: Joi.string().email().required(),
  beneficiaryPhone: Joi.number().required(),
  beneficiaryRole: Joi.string().required(),
  inspectionPeriod: Joi.number().required(),
  milestone: Joi.boolean().required(),
  action: Joi.string().required(),
  items: Joi.array().items(
    Joi.object().keys({
      name: Joi.string(),
      price: Joi.number(),
      category: Joi.string(),
      description: Joi.string(),
      period: Joi.string(),
    })
  ),
});

module.exports = async function (req, res, next) {
  try {
    let dtid;
    const { error, value } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }

    const isUser = await Transaction.find().count();
    if (isUser > 0) {
      let ax = 1;
      dtid = Number(isUser) + Number(ax);
    } else {
      dtid = 3;
    }
    value.tid = "trs" + new Date().getFullYear() + dtid;
    const transaction = await Transaction.create({ ...value });

    return res.status(200).json({
      status: "success",
      data: transaction?.tid,
      response: transaction,
    });
  } catch (error) {
    next(error);
  }
};
