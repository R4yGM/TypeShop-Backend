import { Request, Response } from 'express';
import Cart from '../models/cartModel';
import asyncHandler from 'express-async-handler';
const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');

// Aggiungi un prodotto al carrello dell'utente o crea un nuovo carrello

//se non va manda solo il product ID e cerca
const addToCart = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const  product  = req.body;
    console.dir( req.user._id);
    
    const productId = mongoose.Types.ObjectId(product?._id)
    // Check if the 'product' object exists and has the required properties
    if (!product || !product?.name || !product?.image || !product?.price) {
      return res.status(400).json({ error: 'Invalid product data' });
    }

    // Cerca un carrello esistente per l'utente
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // Aggiungi il prodotto al carrello esistente
      //const existingProduct = cart.cartItems.find((item) => item._id === product?._id);
      const existingProduct = cart.cartItems.find((item) => item._id.equals(productId));

      if (existingProduct) {
        // Se il prodotto esiste già nel carrello, aumenta la quantità
        existingProduct.qty += 1;
      } else {
        // Altrimenti, aggiungi il prodotto al carrello con qty 1
        cart.cartItems.push({
          name: product?.name,
          image: product?.image,
          _id: mongoose.Types.ObjectId(product?._id),
          price: product?.price,
          pandabuy_url: product?.pandabuy_url,
          qty: 1
        });
      }

      // Calcola il nuovo prezzo totale
      cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.price * item.qty, 0);
    } else {
      // Crea un nuovo carrello con il prodotto
      cart = new Cart({
        user: req.user._id,
        cartItems: [{
          name: product?.name,
          image: product?.image,
          _id: mongoose.Types.ObjectId(product?._id),
          price: product?.price,
          pandabuy_url: product?.pandabuy_url,
          qty: 1
        }],
        totalPrice: product?.price
      });
    }

    const savedCart = await cart.save();

    res.status(201).json({"status":"success"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Errore nella gestione del carrello' });
  }
};

  // Rimuovi un prodotto dal carrello dell'utente o crea un nuovo carrello
  const removeFromCart = async (req: any, res: Response): Promise<void> => {
    try {
      const  product  = req.body;
      const userId = req.user._id;
      //const { userId, product } = req.body;
      const productId = mongoose.Types.ObjectId(product?._id)
  
      // Cerca un carrello esistente per l'utente
      let cart = await Cart.findOne({ user: req.user._id });
  
      if (cart) {
        // Cerca il prodotto nel carrello
        
        const existingProductIndex =  cart.cartItems.findIndex((item) => item._id.equals(productId));
  
        if (existingProductIndex !== -1) {
          // Se il prodotto è nel carrello, riduci la quantità o rimuovilo
          if (cart.cartItems[existingProductIndex].qty === 1) {
            // Se la quantità è 1, rimuovi completamente il prodotto
            cart.cartItems.splice(existingProductIndex, 1);
          } else {
            // Altrimenti, diminuisci la quantità di 1
            cart.cartItems[existingProductIndex].qty -= 1;
          }
  
          // Calcola il nuovo prezzo totale
          cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.price * item.qty, 0);
        }
  
        const savedCart = await cart.save();
  
        res.status(200).json(savedCart);
      } else {
        res.status(404).json({ error: 'Carrello non trovato' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Errore nella gestione del carrello' });
    }
  };

// @desc    get user cart items
// @route   Get /api/cart/get-cart
// @access  Private


export const getCartItems = asyncHandler(
  async (req: any, res: Response) => {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        res.status(200).json({ error: 'Carrello non trovato' });
        return;
      }
  
      const cartItems = cart.cartItems;
  
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ error: 'Errore nell ottenere i prodotti del carrello' });
    }
  }
);

export const getCartItemsLength = asyncHandler(
  async (req: any, res: Response): Promise<void> => {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
  
      if (!cart) {
        res.status(200).json({ error: 'Carrello non trovato' });
      }else{

        const cartItems = cart.cartItems;
        const cartLength = cartItems.length;
    
        res.status(200).json({ length: cartLength });

      }

    } catch (error) {
      res.status(500).json({ error: 'Error' });
    }
  }
);

  export { addToCart, removeFromCart };
