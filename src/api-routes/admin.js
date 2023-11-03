const router = require("express").Router();
//Importing routes...........................................

const getAllAdmins = require("../controllers/admin/getAllAdmins");
const updatePassword = require("../controllers/admin/updatePassword");

router.get('/all', getAllAdmins);
router.patch("/password/:id", updatePassword);

module.exports = router;
