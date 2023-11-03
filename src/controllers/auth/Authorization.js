const jwt = require("jsonwebtoken");
const { Admin, enumRole } = require("../../Models/User");
const { TOKEN_SECRET } = require("../../configs/constants");

const verifyToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from header
      token = req.headers.authorization.split(" ")[1];

      //verify token
      const decoded_admin = jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).json("invalid token");
        } else {
          req.admin = decoded;
          next();
        }
      });

      //get user from token
      // req.user = await User.find (decoded.id,decoded.role).select('-password')
      // next()
    } catch (error) {
      res.status(401).json(error.message);
    }
  }
  if (!token) {
    res
      .status(401)
      .json({ message: "Access denied. No token for authorization" });
  }
};

const verifyTokenForUserAndAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.admin.id === req.params.id || ["admin"].includes(req.admin.role)) {
      next();
    } else {
      res
        .status(401)
        .json({
          error:
            "You've not been authorized for this operation. Please contact admin",
        });
    }
  });
};

const verifyTokenForAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (enumRole.includes(req.admin.role)) {
      next();
    } else {
      res.status(401).json({ error: "Not Authorized. You're not an admin" });
    }
  });
};
module.exports = {
  verifyToken,
  verifyTokenForUserAndAdmin,
  verifyTokenForAdmin,
};
