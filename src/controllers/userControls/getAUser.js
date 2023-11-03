const UserModel = require("../../Models/User");

module.exports = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user = await UserModel.findOne({ _id });

    return res.status(200).json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
