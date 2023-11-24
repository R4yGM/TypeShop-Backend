import express from 'express';
import {
    getCartItems,
    addToCart,
    removeFromCart,
    getCartItemsLength,
} from '../controllers/cartController';
import { admin, auth } from '../middleware/auth';
const router = express.Router();

router.route('/get-cart').get(auth, getCartItems);
router.route('/add-item').post(auth, addToCart)
router.route('/remove-item').post(auth, removeFromCart)
router.route('/size').get(auth, getCartItemsLength)

export default router;
