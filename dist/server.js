"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const suggestion_1 = __importDefault(require("./routes/suggestion"));
const morgan_1 = __importDefault(require("morgan"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '/.env'),
});
(0, db_1.default)();
const app = (0, express_1.default)();
if (config_1.default.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('backend operational');
});
app.use(express_1.default.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(express_1.default.urlencoded({ limit: '100mb' }));
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/uploads', uploadRoutes_1.default);
app.use('/api/suggestion', suggestion_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), '/uploads')));
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
const PORT = config_1.default.PORT || 1337;
const server = app.listen(PORT, () => console.log(`🟢 Server running in ${config_1.default.NODE_ENV} mode on port ${PORT}`));
