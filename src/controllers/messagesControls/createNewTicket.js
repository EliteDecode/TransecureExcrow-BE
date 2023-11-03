const Joi = require("joi");
// const Organization = require("../../Models/Organization");
const AdminSupport = require("../../Models/adminSupport");

const Schema = Joi.object({
  reader: Joi.string().required(),
  title: Joi.string(),
  status: Joi.string(),
});

module.exports = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }

    // const isOrganization = await Organization.findOne({ _id: value.reader });
    // if (!isOrganization) {
    //   return res.status(400).json({
    //     error: { message: "Server Error" },
    //   });
    // }

    const adminSupport = await AdminSupport.create({ ...value});

    return res.status(200).json({ status: "success",adminSupport});
  } catch (err) {
    next(err);
  }
};
