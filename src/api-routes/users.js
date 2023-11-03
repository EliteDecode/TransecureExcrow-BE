const router = require("express").Router();
const userIsAuthenticated = require("../middlewares/userIsAuthenticated");
const verifyTokenForAdmin = require("../middlewares/authMiddleware/verifyTokenForAdmin");
const updateUserImages = require("../controllers/userControls/updateUserImages");
//Importing routes...........................................

const getAUser = require("../controllers/userControls/getAUser.js");
const getAllUsers = require("../controllers/userControls/getAllUsers");
const updateAgentProfile = require("../controllers/userControls/updateAgentProfile");
const updateUserDetails = require("../controllers/userControls/updateUserDetails");
const updatePassword = require("../controllers/userControls/updatePassword");
const getUserByDomain = require("../controllers/userControls/getUserByDomain");
const updateUserOrg = require("../controllers/userControls/updateUserOrg");
const deleteUsersByOrg = require("../controllers/userControls/deleteUsersByOrg");
const updateUserSign = require("../controllers/userControls/updateUserSign");
const updateUserImage = require("../controllers/userControls/updateUserImage");
const updateUserQr = require("../controllers/userControls/updateUserQr");
const updateUserInfo = require("../controllers/userControls/updateUserInfo");
const updateRole = require("../controllers/userControls/updateRole");
const resetPassword = require("../controllers/userControls/resetPassword");
const createNewPassword = require("../controllers/userControls/createNewPassword");
const sendVerifyUserEmail = require("../controllers/userControls/sendVerifyUserEmail");
const verifyUserEmail = require("../controllers/userControls/verifyUserEmail");

router.get("/domain/:domain", userIsAuthenticated, getUserByDomain);
router.get("/", verifyTokenForAdmin, getAllUsers);
router.get("/user/:id", userIsAuthenticated, getAUser);
router.get("/auser/:id", verifyTokenForAdmin, getAUser);
router.get("/verifyUserEmail/:userId/:uniqueString", verifyUserEmail);
router.post("/sendVerifyUserEmail", sendVerifyUserEmail);
router.put("/images/:id", userIsAuthenticated, updateUserImages);
router.patch("/images/:id", updateUserImages);
router.patch("/sign/:id", updateUserSign);
router.patch("/pic/:id", updateUserImage);
router.patch("/qrcode/:id", updateUserQr);
router.patch("/org/:id", verifyTokenForAdmin, updateUserOrg);
router.patch("/agent/:id", updateAgentProfile);
router.put("/:id", userIsAuthenticated, updateUserDetails);
router.put("/user/:id", userIsAuthenticated, updateUserInfo);
router.post("/reset-password", resetPassword);
router.put("/create-password/:email/:tkn", createNewPassword);
router.put("/role/:id", updateRole);
router.patch("/password/:id", updatePassword);
router.delete("/domain/:domain", verifyTokenForAdmin, deleteUsersByOrg);

module.exports = router;
