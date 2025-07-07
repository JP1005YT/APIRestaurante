"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = __importDefault(require("../baseController"));
class ProductController extends baseController_1.default {
    constructor() {
        super();
    }
    getAllProducts(req, res) {
        try {
            const products = this.db.prepare("SELECT * FROM products").all();
            res.send({ products });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao buscar produtos" });
        }
    }
    getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id);
            if (!product) {
                return res.status(404).send({ error: "Produto não encontrado" });
            }
            res.send({ product });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao buscar produto" });
        }
    }
    createProduct(req, res) {
        try {
            const { id, name, description, price, category, image } = req.body;
            const stmt = this.db.prepare(`
                INSERT INTO products (id, name, description, price, category, image) 
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            stmt.run(id, name, description, price, category, image);
            res.status(201).send({ message: "Produto criado com sucesso", product: req.body });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao criar produto" });
        }
    }
    updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const product = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id);
            if (!product) {
                return res.status(404).send({ error: "Produto não encontrado" });
            }
            const fields = Object.keys(updates).filter(key => key !== 'id');
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => updates[field]);
            const stmt = this.db.prepare(`UPDATE products SET ${setClause} WHERE id = ?`);
            stmt.run(...values, id);
            res.send({ message: "Produto atualizado com sucesso" });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao atualizar produto" });
        }
    }
    deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const product = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id);
            if (!product) {
                return res.status(404).send({ error: "Produto não encontrado" });
            }
            const stmt = this.db.prepare("DELETE FROM products WHERE id = ?");
            stmt.run(id);
            res.send({ message: "Produto deletado com sucesso" });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao deletar produto" });
        }
    }
    getProductsByCategory(req, res) {
        try {
            const { category } = req.params;
            const products = this.db.prepare("SELECT * FROM products WHERE category = ?").all(category);
            res.send({ products });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao buscar produtos por categoria" });
        }
    }
}
exports.default = ProductController;
