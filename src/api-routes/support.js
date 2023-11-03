const router = require("express").Router();
const verifyTokenForAdmin = require('../middlewares/authMiddleware/verifyTokenForAdmin');
const verifyToken = require('../middlewares/authMiddleware/verifyAccessToken');
//Importing routes...........................................
const createNewTicket = require("../controllers/messagesControls/createNewTicket");
const addNewMessages = require("../controllers/messagesControls/addNewMessages");
const updateTicket = require("../controllers/messagesControls/updateTicket");
const closeTicket = require("../controllers/messagesControls/closeTicket");


router.post("/", createNewTicket);
router.post("/message", addNewMessages);
router.patch("/update/:id", updateTicket);
router.patch("/close/:id", closeTicket);

module.exports = router;
