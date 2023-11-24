"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.addToCart = exports.getCartItems = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const { ObjectId } = require('mongoose').Types;
// Aggiungi un prodotto al carrello dell'utente o crea un nuovo carrello
//se non va manda solo il product ID e cerca
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const product = req.body;
        console.dir(req.body);
        // Check if the 'product' object exists and has the required properties
        if (!product || !(product === null || product === void 0 ? void 0 : product.name) || !(product === null || product === void 0 ? void 0 : product.image) || !(product === null || product === void 0 ? void 0 : product.price)) {
            return res.status(400).json({ error: 'Invalid product data' });
        }
        // Cerca un carrello esistente per l'utente
        let cart = yield cartModel_1.default.findOne({ user: ObjectId(userId) });
        if (cart) {
            // Aggiungi il prodotto al carrello esistente
            const existingProduct = cart.cartItems.find((item) => item._id === (product === null || product === void 0 ? void 0 : product._id));
            if (existingProduct) {
                // Se il prodotto esiste già nel carrello, aumenta la quantità
                existingProduct.qty += 1;
            }
            else {
                // Altrimenti, aggiungi il prodotto al carrello con qty 1
                cart.cartItems.push({
                    name: product === null || product === void 0 ? void 0 : product.name,
                    image: product === null || product === void 0 ? void 0 : product.image,
                    _id: ObjectId(product === null || product === void 0 ? void 0 : product._id),
                    price: product === null || product === void 0 ? void 0 : product.price,
                    qty: 1
                });
            }
            // Calcola il nuovo prezzo totale
            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.price * item.qty, 0);
        }
        else {
            // Crea un nuovo carrello con il prodotto
            cart = new cartModel_1.default({
                user: ObjectId(userId),
                cartItems: [{
                        name: product === null || product === void 0 ? void 0 : product.name,
                        image: product === null || product === void 0 ? void 0 : product.image,
                        _id: ObjectId(product === null || product === void 0 ? void 0 : product._id),
                        price: product === null || product === void 0 ? void 0 : product.price,
                        qty: 1
                    }],
                totalPrice: product === null || product === void 0 ? void 0 : product.price
            });
        }
        const savedCart = yield cart.save();
        res.status(201).json(savedCart);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Errore nella gestione del carrello' });
    }
});
exports.addToCart = addToCart;
// Rimuovi un prodotto dal carrello dell'utente o crea un nuovo carrello
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        const userId = req.params.id;
        //const { userId, product } = req.body;
        // Cerca un carrello esistente per l'utente
        let cart = yield cartModel_1.default.findOne({ user: userId });
        if (cart) {
            // Cerca il prodotto nel carrello
            const existingProductIndex = cart.cartItems.findIndex((item) => item._id === product._id);
            if (existingProductIndex !== -1) {
                // Se il prodotto è nel carrello, riduci la quantità o rimuovilo
                if (cart.cartItems[existingProductIndex].qty === 1) {
                    // Se la quantità è 1, rimuovi completamente il prodotto
                    cart.cartItems.splice(existingProductIndex, 1);
                }
                else {
                    // Altrimenti, diminuisci la quantità di 1
                    cart.cartItems[existingProductIndex].qty -= 1;
                }
                // Calcola il nuovo prezzo totale
                cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.price * item.qty, 0);
            }
            const savedCart = yield cart.save();
            res.status(200).json(savedCart);
        }
        else {
            res.status(404).json({ error: 'Carrello non trovato' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Errore nella gestione del carrello' });
    }
});
exports.removeFromCart = removeFromCart;
// @desc    get user cart items
// @route   Get /api/cart/get-cart
// @access  Private
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id; // Ottieni l'ID dell'utente dalla rotta
        const cart = yield cartModel_1.default.findOne({ user: userId });
        if (!cart) {
            res.status(200).json({ error: 'Carrello non trovato' });
            return;
        }
        const cartItems = cart.cartItems;
        res.status(200).json(cartItems);
    }
    catch (error) {
        res.status(500).json({ error: 'Errore nell ottenere i prodotti del carrello' });
    }
});
exports.getCartItems = getCartItems;
