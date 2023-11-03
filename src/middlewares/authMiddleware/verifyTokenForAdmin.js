const jwt = require("jsonwebtoken");
const verifyTokenForAdmin = async(req,res,next ) => {
    const headers = req.headers;
  //   console.log(headers);
  let token = headers["authorization"];

  //   console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Access Denied" });
  }
  token = token.split(" ")[1];
  try {
    const payload = await jwt.verify(
      token,
      require("../../configs/constants").ADMIN_TOKEN_SECRET
    );
    console.log(payload);
    req.admin = { _id: payload._id, role: payload.role };
    next();
  } catch (err) {
    return res.status(403).json(err);
  }
};
module.exports= verifyTokenForAdmin;