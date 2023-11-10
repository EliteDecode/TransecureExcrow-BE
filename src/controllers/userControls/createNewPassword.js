const User = require("../../Models/User");

module.exports = async function (req, res, next) {
  try {
    console.log(req.body.values);

    // value.password = await bcrypt.hash(value.newPassword, 12);

    // const user = await User.findOneAndUpdate({ email }, { password: value.newPassword});
    // if (user) {
    //   return res.status(200).json({ status: "success" });
    // }
  } catch (error) {
    next(error);
  }
};
