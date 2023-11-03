const Product = require("../../Models/Product");

const Joi = require("joi");
const constants = require("../../configs/constants");
const referralCodeGenerator = require("referral-code-generator");

const Schema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  manufacturer: Joi.string().required(),
  costPrice: Joi.string().required(),
  sellingPrice: Joi.string().required(),
  qtyPerUnit: Joi.number().integer().required(),
  unitOfSale: Joi.string().required(),
  minimumQty: Joi.number().integer().required(),
});

module.exports = async function (req, res, next) {
  try {
    const _id = req.product._id;
    const { error, value } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
        
    const product = await Product.findOneAndUpdate({ _id }, value);


    // }
    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    next(error);
  }
};
