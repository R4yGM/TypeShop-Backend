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
exports.S3 = void 0;
const config_1 = __importDefault(require("../config"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const R2_BUCKET = "rep-bucket";
const getR2Client = () => {
    return new client_s3_1.S3Client({
        region: "auto",
        endpoint: `https://${config_1.default.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: config_1.default.R2_ACCESS_KEY,
            secretAccessKey: config_1.default.R2_SECRET_KEY,
        },
    });
};
class S3 {
    static get(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield getR2Client().send(new client_s3_1.GetObjectCommand({
                Bucket: R2_BUCKET,
                Key: fileName,
            }));
            if (!file) {
                throw new Error("not found.");
            }
            return file.Body;
        });
    }
    static put(fileName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(getR2Client(), new client_s3_1.PutObjectCommand({
                Bucket: R2_BUCKET,
                Key: fileName,
            }), { expiresIn: 60 });
            console.log(signedUrl);
            yield fetch(signedUrl, {
                method: "PUT",
                body: data,
            });
            return `Success`;
        });
    }
}
exports.default = S3;
exports.S3 = S3;
