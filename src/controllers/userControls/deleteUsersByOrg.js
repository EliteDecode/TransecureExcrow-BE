const User = require("../../Models/User");

module.exports = async (req, res, next) => {
  try {
    const domain = req.params.domain;
    const usersDeleted = await User.deleteMany(
        { "domain": domain});


    if (usersDeleted) {
            return res.status(200).json("Users Deleted");
      } else {
        res.status(401).json("Users not found");
      }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};
