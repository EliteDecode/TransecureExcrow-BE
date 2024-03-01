const router = require("express").Router();
const addNewTransaction = require("../controllers/transactionsControls/addNewTransaction");
const agreeTransaction = require("../controllers/transactionsControls/agreeTransaction");
const getAllTransactions = require("../controllers/transactionsControls/getAllTransactions");
const getAllTransactionsByUser = require("../controllers/transactionsControls/getAllTransactionsByUser");
const getTransaction = require("../controllers/transactionsControls/getTransaction");
const payTransaction = require("../controllers/transactionsControls/payTransaction");
const userIsAuthenticated = require("../middlewares/userIsAuthenticated");

// router.get("/", userIsAuthenticated, getAllTransactions);
router.get("/view/:tid/:uid", userIsAuthenticated, getTransaction);
router.post("/start", userIsAuthenticated, addNewTransaction);
router.put("/agree/:tid", userIsAuthenticated, agreeTransaction);
router.put("/pay/:tid", userIsAuthenticated, payTransaction);
router.get("/:userId", userIsAuthenticated, getAllTransactionsByUser);
module.exports = router;
