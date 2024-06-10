const CartService = require("../services/cart.service");
const cartService = new CartService();

const ProductModel = require("../models/product.model");
const CartModel = require("../models/carts.model");

const response = require("../utils/reusable");

class CartController {

    async postCart(req, res) {
        try {
            await cartService.createCart();
            response(res, 200, { message: "Carrito creado exitosamente." })
        } catch (error) {
            console.error("Error al crear un nuevo carrito", error);
            res.status(500).json();
            response(res, 500, { error: "Error interno del servidor" })
        }
    }

    async getCart(req, res){
        const {cid} = req.params;

        try {
            const cart = await cartService.getCartById(cid);

            if (!cart) {
                response(res, 404, { message: "Carrito no encotrado" });
                return null;
            }
            res.json(cart.products);
        } catch (error) {
            response(res, 500, { error: "Error interno del servidor." });
        }
    }

    async addProductToCart(req, res){
        const cid = req.user.cart._id;
        const pid = req.products.product._id;
        const quantity = req.body.quantity || 1;
        try {
            const cart = await CartModel.findOne({ _id: cid });
            const product = await ProductModel.findOne({ _id: pid });

            if (!cart) {
                return response(res, 404, { message: "Carrito no encontrado" });
            }

            if (!product) {
                return response(res, 404, { message: "Producto no encontrado" });
            }
            console.log(cid, pid);
            const cartUpdate = await cartService.addProductToCart(cid, pid, quantity);
            response(res, 200, cartUpdate.products)

        } catch (error) {
            console.error("Error al agregar el producto.", error);
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async removeProductInCart(req, res){
        try {
            const {cid, pid} = req.params;

            const updatedCart = await cartService.deleteProduct(cid, pid);
    
            response(res, 200, {message: 'Producto eliminado del carrito correctamente', updatedCart});

        } catch (error) {
            console.error('Error al eliminar el producto del carrito', error);
            res.status(404).json({
                status: 'error',
                error: 'Error interno del servidor',
            });
        }
    }

    async updateCart(req, res){
        const {cid} = req.params;
        const updatedProducts = req.body;
    
        try {
            const updatedCart = await cartService.updateCart(cid, updatedProducts);
            response(res, 200, updatedCart);
        } catch (error) {
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async updateProductInCart(req, res){
        try {
            const {cid, pid} = req.params;
            const {quantity} = req.body;
    
            const updtProduct = await cartService.updateProductQuantity(cid, pid, quantity);
            response(res, 200, updtProduct);
        } catch (error) {
            response(res, 500, {message: "Error interno del servidor"});
        }
    }

    async emptyCart(req, res){
        try {
            const {cid} = req.params;
            
            const updatedCart = await cartService.emptyCart(cid);
    
            response(res, 200, updatedCart);
        } catch (error) {
            response(res, 500, {message: "Error interno del servidor"});
        }
    }
}

module.exports = CartController;