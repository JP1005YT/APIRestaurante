import { FastifyRequest, FastifyReply } from "fastify";
import { ProductInterface } from "./ProductInterface";
import BaseController from "../baseController";

export default class ProductController extends BaseController {
    
    constructor() {
        super();
    }

    getAllProducts(req: FastifyRequest, res: FastifyReply) {
        try {
            const products = this.db.prepare("SELECT * FROM products").all();
            res.send({ products });
        } catch (error) {
            res.status(500).send({ error: "Erro ao buscar produtos" });
        }
    }

    getProductById(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const product = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id);
            
            if (!product) {
                return res.status(404).send({ error: "Produto não encontrado" });
            }
            
            res.send({ product });
        } catch (error) {
            res.status(500).send({ error: "Erro ao buscar produto" });
        }
    }

    createProduct(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id, name, description, price, category, image } = req.body as ProductInterface;
            
            const stmt = this.db.prepare(`
                INSERT INTO products (id, name, description, price, category, image) 
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            
            stmt.run(id, name, description, price, category, image);
            
            res.status(201).send({ message: "Produto criado com sucesso", product: req.body });
        } catch (error) {
            res.status(500).send({ error: "Erro ao criar produto" });
        }
    }

    updateProduct(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const updates = req.body as Partial<ProductInterface>;
            
            const product = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id);
            if (!product) {
                return res.status(404).send({ error: "Produto não encontrado" });
            }
            
            const fields = Object.keys(updates).filter(key => key !== 'id');
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => updates[field as keyof ProductInterface]);
            
            const stmt = this.db.prepare(`UPDATE products SET ${setClause} WHERE id = ?`);
            stmt.run(...values, id);
            
            res.send({ message: "Produto atualizado com sucesso" });
        } catch (error) {
            res.status(500).send({ error: "Erro ao atualizar produto" });
        }
    }

    deleteProduct(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            
            const product = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id);
            if (!product) {
                return res.status(404).send({ error: "Produto não encontrado" });
            }
            
            const stmt = this.db.prepare("DELETE FROM products WHERE id = ?");
            stmt.run(id);
            
            res.send({ message: "Produto deletado com sucesso" });
        } catch (error) {
            res.status(500).send({ error: "Erro ao deletar produto" });
        }
    }

    getProductsByCategory(req: FastifyRequest, res: FastifyReply) {
        try {
            const { category } = req.params as { category: string };
            const products = this.db.prepare("SELECT * FROM products WHERE category = ?").all(category);
            res.send({ products });
        } catch (error) {
            res.status(500).send({ error: "Erro ao buscar produtos por categoria" });
        }
    }
}

