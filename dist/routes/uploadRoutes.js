"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid"); // Importa la libreria uuid
const admin = __importStar(require("firebase-admin"));
const storageBucketUrl = "rep-project-1337.appspot.com";
const config_1 = __importDefault(require("../config"));
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: config_1.default.FIREBASE_projectId,
        clientEmail: config_1.default.FIREBASE_clientEmail,
        privateKey: config_1.default.FIREBASE_privateKey,
    }),
    storageBucket: storageBucketUrl.replace(/^gs:\/\//g, ''), // remove gs:// at the beginning of the url
});
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const uploadImg = (0, multer_1.default)({ storage });
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new Error('Images only!'), false);
    }
}
const uploadImage = (destination, image, ContentType) => __awaiter(void 0, void 0, void 0, function* () {
    const file = admin.storage().bucket().file(destination);
    yield file.save(image, { contentType: ContentType });
    console.log(file.publicUrl());
    return file.publicUrl();
});
gs: //rep-project-1337.appspot.com/a97d24af-4891-4b3a-9f2a-43447ca4f09d-1696942897314-353px-Database-icon.png
 
// @desc    upload image
// @route   Post /api/image
// @access  Private
router.post('/image', uploadImg.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        var fileId = (0, uuid_1.v4)();
        const objectKey = `${fileId}-${Date.now()}-${req.file.originalname}`;
        const imageBuffer = req.file.buffer;
        var resp = yield uploadImage(objectKey, imageBuffer, req.file.mimetype)
            .then(() => console.log(`'${objectKey}' uploaded successfully`))
            .catch(err => console.error(`failed to upload '${objectKey}'`, err));
        console.log(resp);
        res.status(200).json({ url: `https://firebasestorage.googleapis.com/v0/b/rep-project-1337.appspot.com/o/${objectKey}?alt=media` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}));
exports.default = router;
