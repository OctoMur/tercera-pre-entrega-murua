const ProductModel = require("../models/product.model.js");
const ProductService = require("../services/product.service");
const productService = new ProductService();
const CartService = require("../services/cart.service.js");
const cartService = new CartService();

class ViewsController {

    async renderProducts(req, res) {
        try {
            const { page, limit } = req.query;
            const products = await productService.getProducts({
                page: parseInt(page),
                limit: parseInt(limit)
            });
    
            const newArray = products.docs.map(product => {
                const {...rest } = product.toObject();
                return rest;
            });
    
            const cid = req.user.cart._id;
            //console.log(newArray);
            res.render("products", {
                products: newArray,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                totalPages: products.totalPages,
                cid
            });
    
        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor"
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartService.getCart(cartId);

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            let totalPurchase = 0;

            const productsCart = cart.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;

                
                totalPurchase += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });

            res.render("carts", { products: productsCart, totalPurchase, cartId });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderLogin(req, res) {
        if (req.session.login) {
            return res.redirect("/profile");
        }
        res.render("login");
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            console.log("error en la vista real time", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }
}

module.exports = ViewsController;