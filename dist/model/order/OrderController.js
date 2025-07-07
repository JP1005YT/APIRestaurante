"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = __importDefault(require("../baseController"));
class OrderController extends baseController_1.default {
    constructor() {
        super();
    }
    getAllOrders(req, res) {
        try {
            const orders = this.db.prepare(`
                SELECT o.*, 
                       GROUP_CONCAT(p.name || ':' || op.quantity) as products_info
                FROM orders o
                LEFT JOIN order_products op ON o.id = op.order_id
                LEFT JOIN products p ON op.product_id = p.id
                GROUP BY o.id
            `).all();
            res.send({ orders });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao buscar pedidos" });
        }
    }
    getOrderById(req, res) {
        try {
            const { id } = req.params;
            const order = this.db.prepare(`
                SELECT o.*, 
                       GROUP_CONCAT(p.name || ':' || op.quantity) as products_info
                FROM orders o
                LEFT JOIN order_products op ON o.id = op.order_id
                LEFT JOIN products p ON op.product_id = p.id
                WHERE o.id = ?
                GROUP BY o.id
            `).get(id);
            if (!order) {
                return res.status(404).send({ error: "Pedido não encontrado" });
            }
            res.send({ order });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao buscar pedido" });
        }
    }
    createOrder(req, res) {
        try {
            const { table_id, products } = req.body;
            const order_id = `order_${Date.now()}`;
            // Calcular total
            let total = 0;
            for (const item of products) {
                const product = this.db.prepare("SELECT price FROM products WHERE id = ?").get(item.product_id);
                if (product) {
                    total += product.price * item.quantity;
                }
            }
            // Criar pedido
            const orderStmt = this.db.prepare(`
                INSERT INTO orders (id, table_id, total, status, created_at) 
                VALUES (?, ?, ?, ?, ?)
            `);
            orderStmt.run(order_id, table_id, total, 'pending', new Date().toISOString());
            // Adicionar produtos ao pedido
            const productStmt = this.db.prepare(`
                INSERT INTO order_products (order_id, product_id, quantity) 
                VALUES (?, ?, ?)
            `);
            for (const item of products) {
                productStmt.run(order_id, item.product_id, item.quantity);
            }
            res.status(201).send({
                message: "Pedido criado com sucesso",
                order: { id: order_id, table_id, total, status: 'pending' }
            });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao criar pedido" });
        }
    }
    updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = this.db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
            if (!order) {
                return res.status(404).send({ error: "Pedido não encontrado" });
            }
            const stmt = this.db.prepare("UPDATE orders SET status = ? WHERE id = ?");
            stmt.run(status, id);
            res.send({ message: "Status do pedido atualizado com sucesso" });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao atualizar status do pedido" });
        }
    }
    deleteOrder(req, res) {
        try {
            const { id } = req.params;
            const order = this.db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
            if (!order) {
                return res.status(404).send({ error: "Pedido não encontrado" });
            }
            // Deletar produtos do pedido primeiro
            this.db.prepare("DELETE FROM order_products WHERE order_id = ?").run(id);
            // Deletar pedido
            this.db.prepare("DELETE FROM orders WHERE id = ?").run(id);
            res.send({ message: "Pedido deletado com sucesso" });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao deletar pedido" });
        }
    }
    getOrdersByTable(req, res) {
        try {
            const { table_id } = req.params;
            const orders = this.db.prepare(`
                SELECT o.*, 
                       GROUP_CONCAT(p.name || ':' || op.quantity) as products_info
                FROM orders o
                LEFT JOIN order_products op ON o.id = op.order_id
                LEFT JOIN products p ON op.product_id = p.id
                WHERE o.table_id = ?
                GROUP BY o.id
            `).all(table_id);
            res.send({ orders });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao buscar pedidos da mesa" });
        }
    }
    getOrdersByStatus(req, res) {
        try {
            const { status } = req.params;
            const orders = this.db.prepare(`
                SELECT o.*, 
                       GROUP_CONCAT(p.name || ':' || op.quantity) as products_info
                FROM orders o
                LEFT JOIN order_products op ON o.id = op.order_id
                LEFT JOIN products p ON op.product_id = p.id
                WHERE o.status = ?
                GROUP BY o.id
            `).all(status);
            res.send({ orders });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao buscar pedidos por status" });
        }
    }
}
exports.default = OrderController;
