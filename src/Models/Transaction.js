const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    tid: {
      type: String,
      unique: true,
    },
    userId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    escrowFee: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    escrowCharge: {
      type: String,
      enum: ["buyer", "seller", "both"],
      default: "both",
    },
    shippingCharge: {
      type: String,
      enum: ["buyer", "seller", "both"],
      default: "both",
    },
    currency: {
      type: String,
      required: true,
      default: "NGN",
    },
    senderEmail: {
      type: String,
      lowercase: true,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    senderPayRef: {
      type: String,
    },
    beneficiaryEmail: {
      type: String,
      lowercase: true,
      required: true,
    },
    beneficiaryPhone: {
      type: Number,
      required: true,
    },
    beneficiaryRole: {
      type: String,
      enum: ["buyer", "seller"],
      default: "seller",
    },
    beneficiaryPayRef: {
      type: String,
    },
    senderStatus: {
      type: String,
      enum: [
        "awaiting agreement",
        "awaiting payment",
        "awaiting services",
        "awaiting approval",
        "cancelled",
      ],
      default: "awaiting agreement",
    },
    beneficiaryStatus: {
      type: String,
      enum: [
        "awaiting agreement",
        "awaiting payment",
        "awaiting services",
        "awaiting approval",
        "cancelled",
      ],
      default: "awaiting agreement",
    },
    tstage: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    inspectionPeriod: {
      type: Number,
      required: true,
    },
    milestone: {
      type: Boolean,
      required: true,
      default: false,
    },
    action: {
      type: String,
      enum: ["sender", "beneficiary"],
      default: "beneficiary",
    },
    items: [
      {
        name: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
          default: 0,
        },
        category: {
          type: String,
          default: "Services",
        },
        description: {
          type: String,
          default: "",
        },
        period: {
          type: String,
          default: "",
        },
      },
    ],
    history: [
      {
        dateCreated: {
          type: Date,
          default: Date.now,
        },
        type: {
          type: String,
          enum: [
            "modify",
            "cancel",
            "accept",
            "pay",
            "ship",
            "return",
            "receive",
            "complete",
          ],
          default: "modify",
        },
        reason: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
