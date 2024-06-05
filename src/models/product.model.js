//Importacion de mongoose:
const mongoose = require("mongoose");

//Definiendo el esquema:
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:  {
        type: String,
        required: true
    },
    code:  {
        type: String,
        required: true,
        unique: true
    },
    price:  {
        type: Number,
        required: true
    },
    status:  {
        type: Boolean,
    },
    stock:  {
        type: Number,
        required: true
    },
    category:  {
        type: String,
        required: true
    },
    thumbnails:  {
        type: [String]
    },
})

//Definiendo el modelo:
const ProductModel = mongoose.model("product", productSchema);

//Exportacion del modelo

module.exports = ProductModel;
