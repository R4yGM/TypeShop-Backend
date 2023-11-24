"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    cartItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            pandabuy_url: { type: String, required: true },
            _id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
        },
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
}, {
    timestamps: true,
});
const Cart = (0, mongoose_1.model)('Cart', cartSchema);
exports.default = Cart;
