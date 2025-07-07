"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = productsRoutes;
const ProductSchemas_1 = __importDefault(require("../model/product/ProductSchemas"));
const ProductController_1 = __importDefault(require("../model/product/ProductController"));
async function productsRoutes(app) {
    const ProductController = new ProductController_1.default();
    app.get("/products", ProductSchemas_1.default.getAll(), (req, res) => {
        ProductController.getAllProducts(req, res);
    });
    app.get("/products/:id", ProductSchemas_1.default.getById(), (req, res) => {
        ProductController.getProductById(req, res);
    });
    app.post("/products", ProductSchemas_1.default.create(), (req, res) => {
        ProductController.createProduct(req, res);
    });
    app.put("/products/:id", ProductSchemas_1.default.update(), (req, res) => {
        ProductController.updateProduct(req, res);
    });
    app.delete("/products/:id", ProductSchemas_1.default.delete(), (req, res) => {
        ProductController.deleteProduct(req, res);
    });
    app.get("/products/category/:category", ProductSchemas_1.default.getByCategory(), (req, res) => {
        ProductController.getProductsByCategory(req, res);
    });
}
