// const Organization = require("../../Models/Organization");
const Messages = require("../../Models/Messages");
const Joi = require("joi");

const Schema = Joi.object({
  message: Joi.string().required(),
  reader: Joi.string().required(),
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

    const messages = await Messages.create({ ...value});
    

    return res.status(200).json({ status: "success",messages});
  } catch (err) {
    next(err);
  }
};
