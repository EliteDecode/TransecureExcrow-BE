const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
    },
    altPhone: {
      type: String,
    },
    billingAddress: {
      type: String,
    },
    bankAccount: {
      type: Number,
    },
    bankName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", ""],
      default: "",
    },
    lastLogin: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    domain: {
      type: String,
      default: "homelance",
    },
    avatar: {
      type: String,
      default: "/images/avatar.svg",
    },
    transactionPin: {
      type: Number,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspend"],
      default: "active",
    },
    emailVerification: {
      type: String,
      enum: ["verified", "not verified"],
      default: "not verified",
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", UserSchema);
// const enumRole= Admin.schema.path('role').enumValues
module.exports = User;
