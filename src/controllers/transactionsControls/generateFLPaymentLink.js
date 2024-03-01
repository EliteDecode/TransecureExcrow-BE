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
  beneficiaryRole: Joi.string().required(),
  senderRole: Joi.string().required(),
  // email: Joi.string().email().required(),
});

module.exports = async function (req, res, next) {
  try {
    const user = await UserModel.findById(req.user._id);
    const { error, value } = Schema.validate(req.body);
    const tid = req.params.tid;
    const demail = user.email;
    const dname = user.firstName + " " + user.lastName;
    let updatedTransaction;

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    // BUYER'S SECTION (BUYER IS BENEFICIARY)
    if (value.beneficiaryRole == "buyer") {
        const tranFound = await Transaction.findOne({
          tid: tid,
          beneficiaryEmail: demail,
          beneficiaryStatus: "awaiting payment",
        });

        const beneficiaryRole = tranFound.beneficiaryRole;
        if (beneficiaryRole == "buyer") {
            let amount = tranFound.amount;
            const ftid = tranFound.tid;
            const currency = tranFound.currency;
            const bphone = tranFound.beneficiaryPhone;
            const title = tranFound.title;
            const whoCharge = tranFound.escrowCharge;
            let escrowFee = tranFound.escrowFee;
            let addFee;
            if (whoCharge == "both") {
                addFee = escrowFee/2;
                amount = amount + addFee;
            }
            if (whoCharge == "buyer") {
                amount = amount + escrowFee;
            }
            const got = require("got");

            try {
                const response = await got.post("https://api.flutterwave.com/v3/payments", {
                    headers: {
                        Authorization: `Bearer ${constants.FLW_SECRET_KEY}`
                    },
                    json: {
                        tx_ref: "flb"+ftid,
                        amount: amount,
                        currency: currency,
                        redirect_url: "https://www.transecureescrow.com/transaction/view?idNo="+ftid,
                        customer: {
                            email: demail,
                            phonenumber: bphone,
                            name: dname
                        },
                        customizations: {
                            title: "TranSecure Escrow Payments",
                            logo: "https://www.transecureescrow.com/images/logoinvert.png",
                            description: "You are about making payment for "+title+"("+ftid+")"
                        }
                    }
                }).json();
            } catch (err) {
                console.log(err.code);
                console.log(err.response.body);
            }
        }
        
    }
    // BUYER'S SECTION (BUYER IS SENDER)
    if (value.senderRole == "buyer") {
        const tranFound = await Transaction.findOne({
          tid: tid,
          senderEmail: demail,
          senderStatus: "awaiting payment",
        });

        const senderRole = tranFound.senderRole;
        if (senderRole == "buyer") {
            let amount = tranFound.amount;
            const ftid = tranFound.tid;
            const currency = tranFound.currency;
            const bphone = tranFound.senderPhone;
            const title = tranFound.title;
            const whoCharge = tranFound.escrowCharge;
            let escrowFee = tranFound.escrowFee;
            let addFee;
            if (whoCharge == "both") {
                addFee = escrowFee/2;
                amount = amount + addFee;
            }
            if (whoCharge == "buyer") {
                amount = amount + escrowFee;
            }
            const got = require("got");
  
            try {
                const response = await got.post("https://api.flutterwave.com/v3/payments", {
                    headers: {
                        Authorization: `Bearer ${constants.FLW_SECRET_KEY}`
                    },
                    json: {
                        tx_ref: "flb"+ftid,
                        amount: amount,
                        currency: currency,
                        redirect_url: "https://www.transecureescrow.com/transaction/view?idNo="+ftid,
                        customer: {
                            email: demail,
                            phonenumber: bphone,
                            name: dname
                        },
                        customizations: {
                            title: "TranSecure Escrow Payments",
                            logo: "https://www.transecureescrow.com/images/logoinvert.png",
                            description: "You are about making payment for "+title+"("+ftid+")"
                        }
                    }
                }).json();
            } catch (err) {
                console.log(err.code);
                console.log(err.response.body);
            }
        }
    }
    
    // SELLER'S SECTION (SELLER IS BENEFICIARY)
    if (value.beneficiaryRole == "seller") {
        const tranFound = await Transaction.findOne({
          tid: tid,
          beneficiaryEmail: demail,
          beneficiaryStatus: "awaiting payment",
        });

        const beneficiaryRole = tranFound.beneficiaryRole;
        if (beneficiaryRole == "seller") {
            let amount = 0;
            const ftid = tranFound.tid;
            const currency = tranFound.currency;
            const bphone = tranFound.beneficiaryPhone;
            const title = tranFound.title;
            const whoCharge = tranFound.escrowCharge;
            let escrowFee = tranFound.escrowFee;
            let addFee;
            if (whoCharge == "both") {
                addFee = escrowFee/2;
                amount = amount + addFee;
            }
            if (whoCharge == "seller") {
                amount = amount + escrowFee;
            }
            const got = require("got");

            try {
                const response = await got.post("https://api.flutterwave.com/v3/payments", {
                    headers: {
                        Authorization: `Bearer ${constants.FLW_SECRET_KEY}`
                    },
                    json: {
                        tx_ref: "flb"+ftid,
                        amount: amount,
                        currency: currency,
                        redirect_url: "https://www.transecureescrow.com/transaction/view?idNo="+ftid,
                        customer: {
                            email: demail,
                            phonenumber: bphone,
                            name: dname
                        },
                        customizations: {
                            title: "TranSecure Escrow Payments",
                            logo: "https://www.transecureescrow.com/images/logoinvert.png",
                            description: "You are about making payment for "+title+"("+ftid+")"
                        }
                    }
                }).json();
            } catch (err) {
                console.log(err.code);
                console.log(err.response.body);
            }
        }
        
    }
    // SELLER'S SECTION (SELLER IS SENDER)
    if (value.senderRole == "seller") {
        const tranFound = await Transaction.findOne({
          tid: tid,
          senderEmail: demail,
          senderStatus: "awaiting payment",
        });

        const senderRole = tranFound.senderRole;
        if (senderRole == "seller") {
            let amount = 0;
            const ftid = tranFound.tid;
            const currency = tranFound.currency;
            const bphone = tranFound.senderPhone;
            const title = tranFound.title;
            const whoCharge = tranFound.escrowCharge;
            let escrowFee = tranFound.escrowFee;
            let addFee;
            if (whoCharge == "both") {
                addFee = escrowFee/2;
                amount = amount + addFee;
            }
            if (whoCharge == "seller") {
                amount = amount + escrowFee;
            }
            const got = require("got");
  
            try {
                const response = await got.post("https://api.flutterwave.com/v3/payments", {
                    headers: {
                        Authorization: `Bearer ${constants.FLW_SECRET_KEY}`
                    },
                    json: {
                        tx_ref: "flb"+ftid,
                        amount: amount,
                        currency: currency,
                        redirect_url: "https://www.transecureescrow.com/transaction/view?idNo="+ftid,
                        customer: {
                            email: demail,
                            phonenumber: bphone,
                            name: dname
                        },
                        customizations: {
                            title: "TranSecure Escrow Payments",
                            logo: "https://www.transecureescrow.com/images/logoinvert.png",
                            description: "You are about making payment for "+title+"("+ftid+")"
                        }
                    }
                }).json();
            } catch (err) {
                console.log(err.code);
                console.log(err.response.body);
            }
        }
    }

  } catch (error) {
    next(error);
  }
};
