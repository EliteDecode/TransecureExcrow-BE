const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Admin, enumRole } = require("../../Models/User");
const router = require("express").Router();
const { TOKEN_SECRET } = require("../../configs/constants");

router.post("/register", async (req, res) => {
  try {
    const adminExist = await Admin.findOne({ email: req.body.email });
    if (!adminExist) {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(req.body.password, salt);

      let { firstName, lastName, email, password, confirmPassword } = req.body;

      if (!email || !firstName || !lastName || !password || !confirmPassword) {
        return res.status(400).json({
          error: { message: "all fields are required" },
        });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({
          error: { message: "password and confirm password fields must match" },
        });
      }

      const newAdmin = await new Admin({
        firstName,
        lastName,
        email,
        password: hashedpassword,
      });

      await newAdmin.save();
      if (newAdmin) {
        const { password, ...others } = newAdmin._doc;
        res.status(201).json({ message: "Successful Registration", others });
      }
    } else {
      res
        .status(401)
        .json({ message: "unsuccessful registration, email already exist." });
    }
  } catch (err) {
    console.log(err.message);
    res.status(501).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    const admin = await Admin.findOne({ email });
    console.log(admin.role);
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const generateToken = jwt.sign(
        { id: admin._id, role: admin.role },
        TOKEN_SECRET,
        { expiresIn: "14d" }
      );

      return res.status(200).json({
        message: "Admin Logged in successfully",
        id: admin._id,
        token: generateToken,
      });
    } else {
      return res.status(400).json({
        message: "invalid login credentials",
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: err.message,
    });
  }
});
module.exports = router;
