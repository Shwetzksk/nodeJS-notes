const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");

const products = [];

router.get("/add-products", productsController.getAddProducts);

router.post("/add-products", productsController.postAddProducts);

module.exports = router;
