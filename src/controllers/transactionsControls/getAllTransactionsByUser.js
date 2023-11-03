const Transaction = require("../../Models/Transaction");
const UserModel = require("../../Models/User");

module.exports = async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  const userId = req.params.userId;
  const duser = user._id;
  
  if (duser == userId) {
    try {
      const selUser = await UserModel.findById(userId);
      const demail = selUser.email;
      const data = await Transaction.find({$or:[{ senderEmail : demail  },{beneficiaryEmail: demail}]});

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  } else {
    return res.status(404).json({
      error: { message: "Error" },
    });
  }
};
