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
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// Set up multer storage and file filter
const storage = multer_1.default.memoryStorage(); // Store files in memory
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error('Only images are allowed!'));
        }
    },
});
router.use(upload.single('image'));
exports.postSuggestion = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, message } = req.body;
    if (!req.file) {
        const textMessage = `User: ${email}, Message: ${message}`;
        yield Promise.all([
            axios_1.default.get(`https://api.telegram.org/${config_1.default.TELEGRAM_BOT}/sendMessage?chat_id=512362620&text=${textMessage}`, {}),
            axios_1.default.post(`https://api.telegram.org/${config_1.default.TELEGRAM_BOT}/sendMessage?chat_id=5554575228&text=${textMessage}`, {}),
        ]);
        res.status(201).json({ status: 'ok' });
        return;
    }
    const imageBuffer = req.file.buffer; // Access the file buffer from multer
    console.log(email);
    console.log(message);
    try {
        // Upload the image to Imgur
        const imgurResponse = yield axios_1.default.post('https://api.imgur.com/3/image', imageBuffer, {
            headers: {
                Authorization: 'Client-ID aca6d2502f5bfd8',
            },
        });
        // Get the Imgur image URL
        const imgurUrl = imgurResponse.data.data.link;
        const textMessage = `User: ${email}, Message: ${message}`;
        // Send the text message and image to both chat_ids
        yield Promise.all([
            axios_1.default.post(`https://api.telegram.org/${config_1.default.TELEGRAM_BOT}/sendPhoto`, {
                chat_id: '512362620',
                photo: imgurUrl,
                caption: textMessage,
            }),
            axios_1.default.post(`https://api.telegram.org/${config_1.default.TELEGRAM_BOT}/sendPhoto`, {
                chat_id: '5554575228',
                photo: imgurUrl,
                caption: textMessage,
            }),
        ]);
        res.status(201).json({ status: 'ok' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
router.route('/add').post(exports.postSuggestion);
exports.default = router;
