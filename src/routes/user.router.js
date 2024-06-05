const express = require ("express");
const router = express.Router();
const UserModel = require("../models/user.model");
const { createHash } = require("../utils/hashBcrypt");
const passport = require("passport");

router.post("/", passport.authenticate("register", {failureRedirect: "users/registerfail"}), async (req, res) =>{
    console.log("creando...");
    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        email: req.user.email
    }

    req.session.login = true;
    console.log("creado");
    res.redirect("/profile");
})

router.get("/registerfail", (req, res) =>{
    res.send({error: "Registro fallido."});
})

module.exports = router;