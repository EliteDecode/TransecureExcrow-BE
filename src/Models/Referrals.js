const mongoose = require("mongoose");
const ReferralsSchema = new mongoose.Schema(
  {
    referrer: {
      type: String,
      required: true,
    },
    referred: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Referrals = mongoose.model("Referrals", ReferralsSchema);
// const enumRole= Admin.schema.path('role').enumValues
module.exports = Referrals;
