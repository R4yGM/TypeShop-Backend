"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.route('/get-cart').get(auth_1.auth, cartController_1.getCartItems);
router.route('/add-item').post(auth_1.auth, cartController_1.addToCart);
router.route('/remove-item').post(auth_1.auth, cartController_1.removeFromCart);
exports.default = router;
