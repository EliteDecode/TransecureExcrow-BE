const bcrypt = require("bcryptjs");
const UserToken = require("../../Models/tokenModel");
const jwt = require("jsonwebtoken");
const constants = require("../../configs/constants");
const User = require("../../Models/User");

module.exports = async (req, res, next) => {
  const { uniqueString, userId } = req.params;
  const user = await UserToken.findOne({ UserId: userId });

  console.log(user);

  if (!user) {
    res
      .status(400)
      .json(
        "Verification Faild. User record not found or user has been verified"
      );
  } else if (await bcrypt.compare(uniqueString, user.UniqueString)) {
    const { ExpiresAt, _id: tokenId } = user;
    if (ExpiresAt < Date.now()) {
      const deluser = await User.findByIdAndDelete(userId);
      if (deluser) {
        await UserToken.findByIdAndDelete(tokenId);
      }
      res
        .status(400)
        .json(
          "Verification Failed, verification link expired please try to sign in again"
        );
    } else {
      const verifiedUser = await User.findByIdAndUpdate(
        { _id: userId },
        { emailVerification: "verified" },
        {
          new: true,
        }
      );

      if (verifiedUser) {
        const delToekn = await UserToken.findByIdAndDelete(tokenId);
        if (delToekn) {
          const user = await User.findOne({ _id: userId });
          const token = jwt.sign(
            { _id: user._id },
            constants.AGENT_TOKEN_SECRET,
            {
              expiresIn: constants.TOKEN_EXPIRATION_TIME,
            }
          );
          res.status(200).json({ data: user, token });
        }
      }
    }
  } else {
    res.status(400).json("Verification Failed, invalid verification link");
  }
};
