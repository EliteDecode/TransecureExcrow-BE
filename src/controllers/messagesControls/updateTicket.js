const Joi = require("joi");
// const Organization = require("../../Models/Organization");
const AdminSupport = require("../../Models/adminSupport");

const Schema = Joi.object({
  reader: Joi.string(),
  msg: Joi.string(),
});

module.exports = async function (req, res, next) {
  try {
    let adms;
    const cid = req.params.id;
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }

    // const isOrganization = await Organization.findOne({ _id: value.reader });
    // if (!isOrganization) {
    // adms = await AdminSupport.findOneAndUpdate(
    //     { cid },
    //     { $push: { adminMsg: value.msg } },
    //     { new: true }
    //   );
    // } else {
    // adms = await AdminSupport.findOneAndUpdate(
    //     { cid },
    //     { $push: { orgMsg: value.msg } },
    //     { new: true }
    //   );
    // }

    const adminSupport = adms;

    if(adminSupport) {
        return res.status(200).json({ status: "success",adminSupport});

      } else {
        return res.status(400).json('Server Error');      
      }

  } catch (err) {
    next(err);
  }
};
