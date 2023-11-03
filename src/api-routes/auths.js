const verifyTokenForAdmin = require('../middlewares/authMiddleware/verifyTokenForAdmin');
const verifyToken = require('../middlewares/authMiddleware/verifyAccessToken');

const agentsLogin = require("../controllers/auth/agents.login");
const agentsRegister = require("../controllers/auth/agents.register");
const membersRegister = require("../controllers/auth/members.register");
const loginAdmin = require("../controllers/admin/loginAdmin");
const registerAdmin = require("../controllers/admin/registerAdmin");
const usersLogin = require('../controllers/auth/users.login');

const router = require("express").Router();

router.post("/users/login", usersLogin);
router.post('/login',loginAdmin);
router.post('/register',verifyToken,verifyTokenForAdmin,registerAdmin);
router.post("/users/register", membersRegister);

module.exports = router;
