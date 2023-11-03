const UserModel = require("../../Models/User");
const Transaction = require("../../Models/Transaction");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");
const referralCodeGenerator = require("referral-code-generator");

const Schema = Joi.object({
  beneficiaryStatus: Joi.string().required(),
  senderStatus: Joi.string().required(),
  // email: Joi.string().email().required(),
});

module.exports = async function (req, res, next) {
  try {
    const user = await UserModel.findById(req.user._id);
    const { error, value } = Schema.validate(req.body);
    const tid = req.params.tid;
    const demail = user.email;
    let updatedTransaction

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const tranFound = await Transaction.findOne({tid:tid,beneficiaryEmail: demail,beneficiaryStatus:"awaiting agreement"});
    // const tranFound = await Transaction.findOne({ tid,domain });
    const senderRole = tranFound.senderRole;
    const beneficiaryRole = tranFound.beneficiaryRole;
    if(senderRole == "buyer"){
        updatedTransaction = await Transaction.findOneAndUpdate({ tid:tid }, { beneficiaryStatus: value.beneficiaryStatus, senderStatus: value.senderStatus, action: "sender",tstage: "2"},{returnDocument: "after"}); 
    }

    if(beneficiaryRole == "buyer"){
        updatedTransaction = await Transaction.findOneAndUpdate({ tid:tid }, { beneficiaryStatus: value.beneficiaryStatus, senderStatus: value.senderStatus, action: "beneficiary",tstage: "2"},{returnDocument: "after"}); 
    }
    
    return res.status(200).json({status: "success", data: updatedTransaction?.tstage ,
    response: updatedTransaction,});

  } catch (error) {
    next(error);
  }
};
