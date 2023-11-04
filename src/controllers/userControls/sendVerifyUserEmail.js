const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const UserToken = require("../../Models/tokenModel");
const User = require("../../Models/User");
const { sendMail } = require("../../utils/utils");

module.exports = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (user) {
    // const currentUrl = "http://localhost:3000/verify";
    const currentUrl = "http://Transecureescrow.vercel.app/verify";
    const uniqueString = uuidv4();
    const url = `${currentUrl}/${user._id}/${uniqueString}`;

    const salt = await bcrypt.genSalt(10);
    const hashedString = await bcrypt.hash(uniqueString, salt);

    const pendingUser = await UserToken.create({
      UserId: user._id,
      UniqueString: hashedString,
      CreatedAt: Date.now(),
      ExpiresAt: Date.now() + 300000,
    });

    const deleteToken = async () => {
      await UserToken.findOneAndDelete({ UserId: user._id });
    };

    if (pendingUser) {
      await sendMail(
        email,
        "Verification Email",
        `<p> Please Verify your account by clicking <a href='${url}'>here</a> this link will expire in the next 5 minutes </p>`
      )
        .then(() => {
          res
            .status(200)
            .json({ message: "Verification email sent successfully" });
        })
        .catch((error) => {
          deleteToken();
          res.status(400).json("Verification Email could not be sent");
        });
    } else {
      res.status(400).json("Oops something went wrong.");
    }
  } else {
    res.status(400).json("Something went wrong");
  }
};
