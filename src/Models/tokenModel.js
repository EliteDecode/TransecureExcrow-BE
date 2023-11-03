const mongoose = require("mongoose");

const UserTokenSchema = mongoose.Schema({
  UserId: {
    type: String,
  },
  UniqueString: {
    type: String,
  },
  CreatedAt: {
    type: Date,
  },
  ExpiresAt: {
    type: Date,
  },
});

module.exports = mongoose.model("UserToken", UserTokenSchema);
