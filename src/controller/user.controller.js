const UserModel = require("../models/user.model");
const CartModel = require("../models/carts.model");
const {createHash , isValidPassword} = require("../utils/hashBcrypt");
const jwt = require("jsonwebtoken");
const UserDTO = require("../dto/user.dto");
const response = require("../utils/reusable")

class UserController{

    async register(req, res) {
        const { firstName, lastName, email, password, age, admin } = req.body;
        try {
            const registeredUser = await UserModel.findOne({ email });
            if (registeredUser) {
                return response(res, 400, {message: `Este correo ya ha sido registrado`});
            }

            const newCart = new CartModel();
            await newCart.save();

            const newUser = new UserModel({
                firstName,
                lastName,
                email,
                cart: newCart._id, 
                password: createHash(password),
                age,
                admin: admin === 'on'
            });
            await newUser.save();

            const token = jwt.sign({ user: newUser }, "m1$up3rKlaB$ekReT4");

            res.cookie("CookieComponent", token, {
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const userFound = await UserModel.findOne({ email });
            if (!userFound) {
                return res.status(401).send("Usuario no válido");
            }

            const isValid = isValidPassword(password, userFound);
            if (!isValid) {
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: userFound }, "m1$up3rKlaB$ekReT4");

            res.cookie("CookieComponent", token, {httpOnly: true});
            console.log(userFound, isValid);//<-Hasta aca funciona

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async profile(req, res) {
        //Con DTO: 
        const userDto = new UserDTO(req.user.firstName, req.user.lastName, req.user.admin);
        const isAdmin = req.user.admin === 'admin';

        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie("CookieComponent").redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.admin !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
        }
    }

module.exports = UserController;
