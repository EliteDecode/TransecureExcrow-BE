const userIsAuthenticated = require("../middlewares/userIsAuthenticated");
const addNewProduct = require("../controllers/productsControls/addNewProduct");
const getAllProducts = require("../controllers/productsControls/getAllProducts");
const updateProductDetails = require("../controllers/productsControls/updateProductDetails");
const {
  domainValidation,
} = require("../middlewares/validation/domain-validation");

const router = require("express").Router();

router.post("/", userIsAuthenticated, domainValidation, addNewProduct);
router.get("/", userIsAuthenticated, domainValidation, getAllProducts);
router.put("/:id", userIsAuthenticated, domainValidation, updateProductDetails);

// router.post("/members", membersRegister);

module.exports = router;
