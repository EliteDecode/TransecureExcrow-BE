const express = require("express");
const messageController = require("../controllers/messagesControls/message-controller");
const routes = express.Router();

routes.post("/", messageController.sendMessageToAdmin);

module.exports = routes;
