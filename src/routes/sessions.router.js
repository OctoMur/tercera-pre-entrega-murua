const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model");
const { isValidPassword } = require("../utils/hashBcrypt");
const passport = require("passport");

//Login (con Passport)
router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/loginfail"}), async (req, res) =>{

    if(!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        email: req.user.email
    }
    console.log(req.session.user);
    req.session.login = true;
    res.redirect("/profile");
})

router.get("/loginfail", async (req, res) =>{
    console.log("fallo el logeo");
    res.send({error: "Usuario o contraseña incorrectos"});
})

//Version para GitHub
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}) ,async (req, res) =>{

})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) =>{
    //la estrategia nos retornara el usuario, luego lo agregamos a nuestro objeto de sesion.
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile")
})

/*

router.post("/login", async (req, res) =>{
    const {email, password} = req.body;

    try {
        const user = await userModel.findOne({email: email});

        if(user){
            //uso de isValidPassword de bcrypt
            if(isValidPassword(password, user)){
                req.session.login = true;
                req.session.user = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    admin: user.admin ? "Sí" : "No"
                };
                res.redirect("/profile");
            } else {
                res.status(401).send({error: "Password incorrecta"});
            }
        } else {
            res.status(400).send({error: "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(400).send("Error en el login");
    }
})*/

//Logout
router.get("/logout", async (req, res) =>{
    if(req.session.login){
        req.session.destroy();
        res.redirect("/login");
    }
})

module.exports = router;