const express = require("express");
const router = express.Router();

const CartController = require("../controller/cart.controller");
const cartController = new CartController();

const authMiddleware = require("../middleware/authmiddleware.js");

router.use(authMiddleware);


router.post("/", cartController.postCart );

router.get("/:cid", cartController.getCart);

router.post("/:cid/products/:pid", cartController.addProductToCart);

router.delete("/:cid/products/:pid", cartController.removeProductInCart);

router.put("/:cid", cartController.updateCart);

router.put("/:cid/products/:pid", cartController.updateProductInCart);

router.delete("/:cid", cartController.emptyCart);

router.post('/:cid/purchase', cartController.finalizePurchase);

module.exports = router;