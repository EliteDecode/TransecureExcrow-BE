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
  beneficiaryPayRef: Joi.string().required(),
  senderPayRef: Joi.string().required(),
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
    });

    const beneficiaryEmail = tranFound.beneficiaryEmail;
    const senderEmail = tranFound.senderEmail;
    const beneficiaryRole = tranFound.beneficiaryRole;
    const senderRole = tranFound.senderRole;

    // if beneficiary is buyer and beneficiary is paying and sender has paid
    if ((beneficiaryEmail == demail) && (value.beneficiaryStatus == value.senderStatus) && (value.beneficiaryStatus == "awaiting services") && (beneficiaryRole == "buyer")) {
      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          beneficiaryStatus: value.beneficiaryStatus,
          beneficiaryPayRef: value.beneficiaryPayRef,
          action: "sender",
          tstage: "3",
        },
        { returnDocument: "after" }
      );
    }

    // if beneficiary is buyer and beneficiary is paying and sender has not paid
    if ((beneficiaryEmail == demail) && (value.beneficiaryStatus != value.senderStatus) && (value.beneficiaryStatus == "awaiting services") && (beneficiaryRole == "buyer")) {
      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          beneficiaryStatus: value.beneficiaryStatus,
          beneficiaryPayRef: value.beneficiaryPayRef,
          action: "sender",
          tstage: "2",
        },
        { returnDocument: "after" }
      );
    }

    // if beneficiary is seller and beneficiary is paying and sender has paid
    if ((beneficiaryEmail == demail) && (value.beneficiaryStatus == value.senderStatus) && (value.beneficiaryStatus == "awaiting services") && (beneficiaryRole == "seller")) {
      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          beneficiaryStatus: value.beneficiaryStatus,
          beneficiaryPayRef: value.beneficiaryPayRef,
          action: "beneficiary",
          tstage: "3",
        },
        { returnDocument: "after" }
      );
    }

    // if beneficiary is seller and beneficiary is paying and sender has not paid
    if ((beneficiaryEmail == demail) && (value.beneficiaryStatus != value.senderStatus) && (value.beneficiaryStatus == "awaiting services") && (beneficiaryRole == "seller")) {
      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          beneficiaryStatus: value.beneficiaryStatus,
          beneficiaryPayRef: value.beneficiaryPayRef,
          action: "beneficiary",
          tstage: "2",
        },
        { returnDocument: "after" }
      );
    }

    // if sender is buyer and sender is paying and beneficiary has paid
    if ((senderEmail == demail) && (value.beneficiaryStatus == value.senderStatus) && (senderRole == "buyer")) {

      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          senderStatus: value.senderStatus,
          senderPayRef: value.senderPayRef,
          action: "beneficiary",
          tstage: "3",
        },
        { returnDocument: "after" }
      );
    }

    // if sender is buyer and sender is paying and beneficiary has not paid
    if ((senderEmail == demail) && (value.beneficiaryStatus != value.senderStatus) && (senderRole == "buyer")) {

      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          senderStatus: value.senderStatus,
          senderPayRef: value.senderPayRef,
          action: "beneficiary",
          tstage: "2",
        },
        { returnDocument: "after" }
      );
    }

    // if sender is seller and sender is paying and beneficiary has paid
    if ((senderEmail == demail) && (value.beneficiaryStatus == value.senderStatus) && (senderRole == "seller")) {

      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          senderStatus: value.senderStatus,
          senderPayRef: value.senderPayRef,
          action: "sender",
          tstage: "3",
        },
        { returnDocument: "after" }
      );
    }

    // if sender is seller and sender is paying and beneficiary has not paid
    if ((senderEmail == demail) && (value.beneficiaryStatus != value.senderStatus) && (senderRole == "seller")) {

      updatedTransaction = await Transaction.findOneAndUpdate(
        { tid: tid },
        {
          senderStatus: value.senderStatus,
          senderPayRef: value.senderPayRef,
          action: "sender",
          tstage: "2",
        },
        { returnDocument: "after" }
      );
    }
    if (updatedTransaction != "") {
      return res.status(200).json({
        status: "success",
        data: updatedTransaction?.tstage,
        response: updatedTransaction,
      });
    }

    // //if sender and sender was buyer
    // if (updatedTransaction.senderEmail == demail && updatedTransaction.senderRole == "buyer") {
    //   await sendMail(
    //     updatedTransaction.senderEmail,
    //     "Payment Confirmation",
    //     `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
    //       <p style="font-weight: bold;">Your payment for transaction id:  ${tid} was successful and has been confirmed.</p>
    //     </div>`
    //   )
    //     .then(async () => {
    //       await sendMail(
    //         updatedTransaction.beneficiaryEmail,
    //         "Payment Confirmation",
    //         `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
    //           <p style="font-weight: bold;">The Buyer's payment for transaction id: ${tid} has been confirmed.</p>
    //         </div>`
    //       )
    //         .then(() => {
    //           return res.status(200).json({
    //             status: "success",
    //             data: updatedTransaction?.tstage,
    //             response: updatedTransaction,
    //           });
    //         })
    //         .catch((error) => {
    //           deleteToken();
    //           res.status(400).json("Payment Confirmation Email could not be sent");
    //         });
    //     })
    //     .catch((error) => {
    //       deleteToken();
    //       res.status(400).json("Payment Confirmation Email could not be sent");
    //     });
    // }
    // //if sender and sender was seller
    // if (updatedTransaction.senderEmail == demail && updatedTransaction.senderRole == "seller") {
    //   await sendMail(
    //     updatedTransaction.senderEmail,
    //     "Payment Confirmation",
    //     `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
    //       <p style="font-weight: bold;">Your payment for transaction id:  ${tid} was successful and has been confirmed.</p>
    //     </div>`
    //   )
    //     .then(async () => {
    //       await sendMail(
    //         updatedTransaction.beneficiaryEmail,
    //         "Payment Confirmation",
    //         `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
    //           <p style="font-weight: bold;">The Seller's payment for transaction id: ${tid} has been confirmed.</p>
    //         </div>`
    //       )
    //         .then(() => {
    //           return res.status(200).json({
    //             status: "success",
    //             data: updatedTransaction?.tstage,
    //             response: updatedTransaction,
    //           });
    //         })
    //         .catch((error) => {
    //           deleteToken();
    //           res.status(400).json("Payment Confirmation Email could not be sent");
    //         });
    //     })
    //     .catch((error) => {
    //       deleteToken();
    //       res.status(400).json("Payment Confirmation Email could not be sent");
    //     });
    // }

    // //if beneficiary and beneficiary was buyer
    // if (updatedTransaction.beneficiaryEmail == demail && updatedTransaction.beneficiaryRole == "buyer") {
    //   await sendMail(
    //     updatedTransaction.beneficiaryEmail,
    //     "Payment Confirmation",
    //     `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
    //       <p style="font-weight: bold;">Your payment for transaction id:  ${tid} was successful and has been confirmed.</p>
    //     </div>`
    //   )
    //     .then(async () => {
    //       await sendMail(
    //         updatedTransaction.senderEmail,
    //         "Payment Confirmation",
    //         `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
    //           <p style="font-weight: bold;">The Buyer's payment for transaction id: ${tid} has been confirmed.</p>
    //         </div>`
    //       )
    //         .then(() => {
    //           return res.status(200).json({
    //             status: "success",
    //             data: updatedTransaction?.tstage,
    //             response: updatedTransaction,
    //           });
    //         })
    //         .catch((error) => {
    //           deleteToken();
    //           res.status(400).json("Payment Confirmation Email could not be sent");
    //         });
    //     })
    //     .catch((error) => {
    //       deleteToken();
    //       res.status(400).json("Payment Confirmation Email could not be sent");
    //     });
    // }

    // //if beneficiary and beneficiary was seller
    // if (updatedTransaction.beneficiaryEmail == demail && updatedTransaction.beneficiaryRole == "seller") {
    //   await sendMail(
    //     updatedTransaction.beneficiaryEmail,
    //     "Payment Confirmation",
    //     `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
    //       <p style="font-weight: bold;">Your payment for transaction id:  ${tid} was successful and has been confirmed.</p>
    //     </div>`
    //   )
    //     .then(async () => {
    //       await sendMail(
    //         updatedTransaction.senderEmail,
    //         "Payment Confirmation",
    //         `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
    //           <p style="font-weight: bold;">The Seller's payment for transaction id: ${tid} has been confirmed.</p>
    //         </div>`
    //       )
    //         .then(() => {
    //           return res.status(200).json({
    //             status: "success",
    //             data: updatedTransaction?.tstage,
    //             response: updatedTransaction,
    //           });
    //         })
    //         .catch((error) => {
    //           deleteToken();
    //           res.status(400).json("Payment Confirmation Email could not be sent");
    //         });
    //     })
    //     .catch((error) => {
    //       deleteToken();
    //       res.status(400).json("Payment Confirmation Email could not be sent");
    //     });
    // }
  } catch (error) {
    next(error);
  }
};
