const Transaction = require("../../Models/Transaction");
const { sendMail } = require("../../utils/utils");

const Joi = require("joi");

const Schema = Joi.object({
  title: Joi.string().required(),
  userId: Joi.string().required(),
  amount: Joi.number().required(),
  escrowFee: Joi.number().required(),
  shippingFee: Joi.number().required(),
  escrowCharge: Joi.string().required(),
  shippingCharge: Joi.string().required(),
  currency: Joi.string().required(),
  senderEmail: Joi.string().email().required(),
  senderRole: Joi.string().required(),
  beneficiaryEmail: Joi.string().email().required(),
  beneficiaryPhone: Joi.number().required(),
  beneficiaryRole: Joi.string().required(),
  inspectionPeriod: Joi.number().required(),
  milestone: Joi.boolean().required(),
  action: Joi.string().required(),
  items: Joi.array().items(
    Joi.object().keys({
      name: Joi.string(),
      price: Joi.number(),
      category: Joi.string(),
      description: Joi.string(),
      period: Joi.string(),
    })
  ),
});

module.exports = async function (req, res, next) {
  try {
    let dtid;
    const { error, value } = Schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }

    const isUser = await Transaction.find().count();
    if (isUser > 0) {
      let ax = 1;
      dtid = Number(isUser) + Number(ax);
    } else {
      dtid = 3;
    }
    value.tid = "trs" + new Date().getFullYear() + dtid;
    const transaction = await Transaction.create({ ...value });

    if (transaction) {
      await sendMail(
        value.beneficiaryEmail,
        "New Transaction Initiated",
        `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
          <p style="font-weight: bold;">New Transaction Initiated:</p>
          
          <p><strong>Title:</strong> ${value.title}</p>
          <p><strong>Amount:</strong> ${value.amount}</p>
          <p><strong>Escrow Fee:</strong>${value.escrowFee}</p>
          <p><strong>Shipping Fee:</strong> ${value.shippingFee}</p>
          <p><strong>Escrow Charge:</strong>${value.escrowCharge}</p>
          <p><strong>Shipping Charge:</strong> ${value.shippingCharge}</p>
          <p><strong>Currency:</strong> ${value.currency}</p>
          <p><strong>Sender Role:</strong> ${value.senderRole}</p>
          <p><strong>Beneficiary Email:</strong>${value.senderEmail}</p>
          <p><strong>Beneficiary Role:</strong> ${value.senderRole}</p>
          <p><strong>Inspection Period:</strong> ${value.inspectionPeriod}</p>
          <p><strong>Milestone:</strong> ${value.milestone}</p>
          
          <p><strong>Items:</strong></p>
          <ul style="list-style-type: none; padding: 0;">
            ${
              value.items.length > 0 &&
              value.items.map((item) => {
                return ` <li>
                    <p>
                      <strong>Name:</strong> ${item.name}{" "}
                    </p>
                    <p>
                      <strong>Price:</strong> ${item.price}
                    </p>
                    <p>
                      <strong>Category:</strong> ${item.category}
                    </p>
                    <p>
                      <strong>Description:</strong> ${item.description}
                    </p>
                    <p>
                      <strong>Period:</strong> ${item.period}
                    </p>
                  </li>`;
              })
            }
          </ul>
          <p style="font-weight: bold;">Note:</p>
          <p>Please review the details and take necessary actions.</p>
        </div>`
      )
        .then(async () => {
          await sendMail(
            value.senderEmail,
            "New Transaction Initiated",
            `<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; border: 1px solid #ddd;">
              <p style="font-weight: bold;">New Transaction Initiated:</p>
              
              <p><strong>Title:</strong> ${value.title}</p>
              <p><strong>Amount:</strong> ${value.amount}</p>
              <p><strong>Escrow Fee:</strong>${value.escrowFee}</p>
              <p><strong>Shipping Fee:</strong> ${value.shippingFee}</p>
              <p><strong>Escrow Charge:</strong>${value.escrowCharge}</p>
              <p><strong>Shipping Charge:</strong> ${value.shippingCharge}</p>
              <p><strong>Currency:</strong> ${value.currency}</p>
              <p><strong>Sender Role:</strong> ${value.senderRole}</p>
              <p><strong>Beneficiary Email:</strong>${
                value.beneficiaryEmail
              }</p>
              <p><strong>Beneficiary Role:</strong> ${value.beneficiaryRole}</p>
              <p><strong>Beneficiary Phone:</strong> ${
                value.beneficiaryPhone
              }</p>
              <p><strong>Inspection Period:</strong> ${
                value.inspectionPeriod
              }</p>
              <p><strong>Milestone:</strong> ${value.milestone}</p>
              
              <p><strong>Items:</strong></p>
              <ul style="list-style-type: none; padding: 0;">
                ${
                  value.items.length > 0 &&
                  value.items.map((item) => {
                    return ` <li>
                        <p>
                          <strong>Name:</strong> ${item.name}{" "}
                        </p>
                        <p>
                          <strong>Price:</strong> ${item.price}
                        </p>
                        <p>
                          <strong>Category:</strong> ${item.category}
                        </p>
                        <p>
                          <strong>Description:</strong> ${item.description}
                        </p>
                        <p>
                          <strong>Period:</strong> ${item.period}
                        </p>
                      </li>`;
                  })
                }
              </ul>
              <p style="font-weight: bold;">Note:</p>
              <p>Please review the details and take necessary actions.</p>
            </div>`
          )
            .then(() => {
              return res.status(200).json({
                status: "success",
                data: transaction?.tid,
                response: transaction,
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
