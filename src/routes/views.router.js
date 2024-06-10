const express = require("express");
const router = express.Router();
const ViewsController = require("../controller/views.controller");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");



router.get("/products",  viewsController.renderProducts);
router.get("/carts/:cid", viewsController.renderCart);
router.get("/register", viewsController.renderRegister);
router.get("/login", viewsController.renderLogin);
router.get("/realtimeproducts", checkUserRole([true]), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole([false]),passport.authenticate('jwt', { session: false }), viewsController.renderChat);
router.get("/", viewsController.renderHome);

module.exports = router;