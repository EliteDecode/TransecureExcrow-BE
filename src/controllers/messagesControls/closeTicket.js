const Joi = require("joi");
const AdminSupport = require("../../Models/adminSupport");

const Schema = Joi.object({
    reader: Joi.string(),
    status: Joi.string(),
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

    adms = await AdminSupport.findByIdAndUpdate(req.params.id,
        value);

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
