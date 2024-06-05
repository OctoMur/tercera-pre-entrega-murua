const express = require("express");
const router = express.Router();

const ProductController = require("../controller/product.controller");
const productController = new ProductController();

router.get("/", productController.getProducts);

router.get("/:pid", productController.getProductData);

router.post("/", productController.postProduct);

router.put("/:pid", productController.updateProduct);

router.delete("/:pid", productController.deleteProduct);

module.exports = router;