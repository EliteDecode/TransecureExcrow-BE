const Transaction = require("../../Models/Transaction");

module.exports = async (req, res, next) => {
  try {
    const userId = req.user;
    const data = await Transaction.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
