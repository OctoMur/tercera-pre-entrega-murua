const mongoose = require("mongoose");
const ProductModel = require("./product.model");

const cartSchema = new mongoose.Schema({
    products: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'product',
                required: true
            },
            quantity:{
                type: Number,
                required: true
            }
        }
    ]
})

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');
    next();
});

const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;