const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },

    lastName: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true,
        index: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    },

    age: {
        type: Number,
        require: true
    },

    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },

    admin: {
        type: Boolean,
        require: true,
        default: false
    }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;