const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSupportSchema = new Schema(
  {
    reader: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    },
    title: {
      type: String,
    },
    adminMsg: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'Messages' 
        }
    ],
    orgMsg: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'Messages' 
        }
    ],
    status: {
      type: String,
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const AdminSupport = mongoose.model("AdminSupport", AdminSupportSchema);
module.exports = AdminSupport;
