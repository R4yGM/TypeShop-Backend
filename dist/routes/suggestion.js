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
exports.postSuggestion = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const router = express_1.default.Router();
router.use(express_1.default.json());
exports.postSuggestion = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, message } = req.body;
    try {
        var msg = `User: ${email},
            
            Message: ${message}`;
        yield axios_1.default.get(`https://api.telegram.org/${config_1.default.TELEGRAM_BOT}/sendMessage?chat_id=512362620&text=` + msg);
        res.status(201).json({ status: "ok" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
router.route('/add').post(exports.postSuggestion);
exports.default = router;
