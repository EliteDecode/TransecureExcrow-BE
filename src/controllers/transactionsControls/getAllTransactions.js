const Transaction = require("../../Models/Transaction");

module.exports = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({}).sort({updatedAt:-1});

    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
