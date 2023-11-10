const UserModel = require("../../Models/User");
const Transaction = require("../../Models/Transaction");
const { sendMail } = require("../../utils/utils");

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
    let updatedTransaction;

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const tranFound = await Transaction.findOne({
      tid: tid,
      beneficiaryEmail: demail,
      beneficiaryStatus: "awaiting agreement",
    });
    // const tranFound = await Transaction.findOne({ tid,domain });
    const senderRole = tranFound.senderRole;
    const beneficiaryRole = tranFound.beneficiaryRole;
    if (senderRole == "buyer") {
      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          beneficiaryStatus: value.beneficiaryStatus,
          senderStatus: value.senderStatus,
          action: "sender",
          tstage: "2",
        },
        { returnDocument: "after" }
      );
    }

    if (beneficiaryRole == "buyer") {
      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          beneficiaryStatus: value.beneficiaryStatus,
          senderStatus: value.senderStatus,
          action: "beneficiary",
          tstage: "2",
        },
        { returnDocument: "after" }
      );
    }

    if (updatedTransaction) {
      await sendMail(
        updatedTransaction.senderEmail,
        "Transaction Agreed",
        `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
          <p style="font-weight: bold;">Transaction agreed for transaction id:  ${tid}</p>
        </div>`
      )
        .then(async () => {
          await sendMail(
            updatedTransaction.beneficiaryEmail,
            "Transaction Agreed",
            `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
              <p style="font-weight: bold;">Transaction agreed for transaction id:  ${tid}</p>
            </div>`
          )
            .then(() => {
              return res.status(200).json({
                status: "success",
                data: updatedTransaction?.tstage,
                response: updatedTransaction,
              });
            })
            .catch((error) => {
              deleteToken();
              res.status(400).json("Verification Email could not be sent");
            });
        })
        .catch((error) => {
          deleteToken();
          res.status(400).json("Verification Email could not be sent");
        });
    }
  } catch (error) {
    next(error);
  }
};
