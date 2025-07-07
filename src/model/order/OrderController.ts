import { FastifyRequest, FastifyReply } from "fastify";
import { OrderInterface } from "./OrderInterface";
import BaseController from "../baseController";

export default class OrderController extends BaseController {
    
    constructor() {
        super();
    }

    getAllOrders(req: FastifyRequest, res: FastifyReply) {
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
        } catch (error) {
            res.status(500).send({ error: "Erro ao buscar pedidos" });
        }
    }

    getOrderById(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
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
        } catch (error) {
            res.status(500).send({ error: "Erro ao buscar pedido" });
        }
    }

    createOrder(req: FastifyRequest, res: FastifyReply) {
        try {
            const { table_id, products } = req.body as { table_id: string, products: Array<{ product_id: string, quantity: number }> };
            const order_id = `order_${Date.now()}`;
            
            // Calcular total
            let total = 0;
            for (const item of products) {
                const product = this.db.prepare("SELECT price FROM products WHERE id = ?").get(item.product_id) as any;
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
        } catch (error) {
            res.status(500).send({ error: "Erro ao criar pedido" });
        }
    }

    updateOrderStatus(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const { status } = req.body as { status: string };
            
            const order = this.db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
            if (!order) {
                return res.status(404).send({ error: "Pedido não encontrado" });
            }
            
            const stmt = this.db.prepare("UPDATE orders SET status = ? WHERE id = ?");
            stmt.run(status, id);
            
            res.send({ message: "Status do pedido atualizado com sucesso" });
        } catch (error) {
            res.status(500).send({ error: "Erro ao atualizar status do pedido" });
        }
    }

    deleteOrder(req: FastifyRequest, res: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            
            const order = this.db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
            if (!order) {
                return res.status(404).send({ error: "Pedido não encontrado" });
            }
            
            // Deletar produtos do pedido primeiro
            this.db.prepare("DELETE FROM order_products WHERE order_id = ?").run(id);
            
            // Deletar pedido
            this.db.prepare("DELETE FROM orders WHERE id = ?").run(id);
            
            res.send({ message: "Pedido deletado com sucesso" });
        } catch (error) {
            res.status(500).send({ error: "Erro ao deletar pedido" });
        }
    }

    getOrdersByTable(req: FastifyRequest, res: FastifyReply) {
        try {
            const { table_id } = req.params as { table_id: string };
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
        } catch (error) {
            res.status(500).send({ error: "Erro ao buscar pedidos da mesa" });
        }
    }

    getOrdersByStatus(req: FastifyRequest, res: FastifyReply) {
        try {
            const { status } = req.params as { status: string };
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
        } catch (error) {
            res.status(500).send({ error: "Erro ao buscar pedidos por status" });
        }
    }
}

