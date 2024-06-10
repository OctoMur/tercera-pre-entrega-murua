const express = require ("express");
const router = express.Router();
const UserController = require("../controller/user.controller");
const userController = new UserController();
const passport = require("passport");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);


module.exports = router;