const router = require("express").Router();
const newReferral = require("../controllers/referralControls/newReferral");


router.post("/", newReferral);

module.exports = router;
