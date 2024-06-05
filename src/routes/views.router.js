const express = require("express");
const router = express.Router();

const ProductService = require("../services/product.service");
const productService = new ProductService();
const CartService = require("../services/cart.service");
const cartService = new CartService();

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const products = await productService.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const newArray = products.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return rest;
        });

        res.render("products", {
            products: newArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        if (!req.session.login) {
            // Redirige al formulario de login si no está logueado
            return res.redirect("/login");
        }
        const cart = await cartService.getCartById(cartId);

        if (!cart) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const productCart = cart.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));


        res.render("carts", { products: productCart });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {

    /*if (req.session.login) {
        return res.redirect("/profile");
    }*/
    res.render("register");
});


// Ruta para el formulario de login
router.get("/login", (req, res) => {
    // Verifica si el usuario ya está logueado y redirige a la página de perfil si es así
    if (req.session.login) {
        return res.redirect("/profile");
    }

    res.render("login");
});

router.get("/profile", (req, res) => {

    if (!req.session.login) {
        // Redirige al formulario de login si no está logueado
        return res.redirect("/login");
    }

    // Renderiza la vista de perfil con los datos del usuario
    res.render("profile", { user: req.session.user });
});

module.exports = router;