const express = require("express");
const router = express.Router();
const ViewsController = require("../controller/views.controller");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");

//checkUserRole(['usuario']),passport.authenticate('jwt', { session: false }),

router.get("/products",  viewsController.renderProducts);//Falta modificar para discriminar por roles
router.get("/carts/:cid", viewsController.renderCart);
router.get("/register", viewsController.renderRegister);
router.get("/login", viewsController.renderLogin);
router.get("/realtimeproducts", viewsController.renderRealTimeProducts);
router.get("/chat",viewsController.renderChat);//Falta modificar para discriminar por roles
router.get("/", viewsController.renderHome);

module.exports = router;