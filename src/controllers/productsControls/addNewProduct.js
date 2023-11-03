const Product = require("../../Models/Product");

const Joi = require("joi");

const constants = require("../../configs/constants");

const Schema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  manufacturer: Joi.string().required(),
  costPrice: Joi.number().required(),
  sellingPrice: Joi.number().required(),
  availableQty: Joi.number().required(),
  qtyPerUnit: Joi.number().required(),
  unitOfSale: Joi.string().required(),
  minimumQty: Joi.number().required(),
});

module.exports = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }

    // const isUser = await Product.findOne();
    // if (isUser) {
    //   return res.status(400).json({
    //     error: { message: "Email Already Exists" },
    //   });
    // }

    const product = await Product.create({ ...value, domain });

    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    next(error);
  }
};
