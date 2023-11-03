const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    reader: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    },
    message: {
      type: String,
    },
    readStatus: {
      type: String,
      default: "unread",
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("Messages", MessageSchema);
module.exports = Messages;
