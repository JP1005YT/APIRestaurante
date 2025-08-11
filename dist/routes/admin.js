"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = adminRoutes;
const zod_1 = require("zod");
async function adminRoutes(app) {
    // Rota para obter estatísticas gerais do restaurante
    app.get("/admin/stats", {
        schema: {
            tags: ["Admin"],
            summary: "Obter estatísticas do restaurante",
            response: {
                200: zod_1.z.object({
                    totalOrders: zod_1.z.number(),
                    totalRevenue: zod_1.z.number(),
                    totalTables: zod_1.z.number(),
                    totalProducts: zod_1.z.number(),
                    ordersByStatus: zod_1.z.record(zod_1.z.number())
                }),
                500: zod_1.z.object({
                    error: zod_1.z.string()
                })
            }
        }
    }, async (req, res) => {
        try {
            const db = req.server.db;
            const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get()?.count || 0;
            const totalRevenue = db.prepare("SELECT SUM(total) as sum FROM orders WHERE status = 'delivered'").get()?.sum || 0;
            const totalTables = db.prepare("SELECT COUNT(*) as count FROM tables").get()?.count || 0;
            const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products").get()?.count || 0;
            const ordersByStatusResult = db.prepare(`
                SELECT status, COUNT(*) as count 
                FROM orders 
                GROUP BY status
            `).all();
            const ordersByStatus = {};
            ordersByStatusResult.forEach((row) => {
                ordersByStatus[row.status] = row.count;
            });
            res.send({
                totalOrders,
                totalRevenue,
                totalTables,
                totalProducts,
                ordersByStatus
            });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao buscar estatísticas" });
        }
    });
    // Rota para obter relatório de vendas por período
    app.get("/admin/sales-report", {
        schema: {
            tags: ["Admin"],
            summary: "Relatório de vendas por período",
            querystring: zod_1.z.object({
                start_date: zod_1.z.string().optional(),
                end_date: zod_1.z.string().optional()
            }),
            response: {
                200: zod_1.z.object({
                    totalSales: zod_1.z.number(),
                    orderCount: zod_1.z.number(),
                    averageOrderValue: zod_1.z.number(),
                    topProducts: zod_1.z.array(zod_1.z.object({
                        product_name: zod_1.z.string(),
                        quantity_sold: zod_1.z.number(),
                        revenue: zod_1.z.number()
                    }))
                }),
                500: zod_1.z.object({
                    error: zod_1.z.string()
                })
            }
        }
    }, async (req, res) => {
        try {
            const { start_date, end_date } = req.query;
            const db = req.server.db;
            let dateFilter = "";
            const params = [];
            if (start_date && end_date) {
                dateFilter = "WHERE o.created_at BETWEEN ? AND ?";
                params.push(start_date, end_date);
            }
            const salesData = db.prepare(`
                SELECT 
                    SUM(total) as totalSales,
                    COUNT(*) as orderCount,
                    AVG(total) as averageOrderValue
                FROM orders o
                ${dateFilter}
                AND status = 'delivered'
            `).get(...params);
            const topProducts = db.prepare(`
                SELECT 
                    p.name as product_name,
                    SUM(op.quantity) as quantity_sold,
                    SUM(op.quantity * p.price) as revenue
                FROM order_products op
                JOIN products p ON op.product_id = p.id
                JOIN orders o ON op.order_id = o.id
                ${dateFilter.replace('o.created_at', 'o.created_at')}
                AND o.status = 'delivered'
                GROUP BY p.id, p.name
                ORDER BY revenue DESC
                LIMIT 10
            `).all(...params);
            res.send({
                totalSales: salesData?.totalSales || 0,
                orderCount: salesData?.orderCount || 0,
                averageOrderValue: salesData?.averageOrderValue || 0,
                topProducts: topProducts || []
            });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao gerar relatório de vendas" });
        }
    });
    // Rota para backup do banco de dados
    app.post("/admin/backup", {
        schema: {
            tags: ["Admin"],
            summary: "Criar backup do banco de dados",
            response: {
                200: zod_1.z.object({
                    message: zod_1.z.string(),
                    backup_file: zod_1.z.string()
                }),
                500: zod_1.z.object({
                    error: zod_1.z.string()
                })
            }
        }
    }, async (req, res) => {
        try {
            const fs = require('fs');
            const path = require('path');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `backup_${timestamp}.db`;
            const sourcePath = path.join(__dirname, '../modules/dataManager/bd.db');
            const backupPath = path.join(__dirname, '../../../backups', backupFileName);
            // Criar diretório de backup se não existir
            const backupDir = path.dirname(backupPath);
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            // Copiar arquivo do banco
            fs.copyFileSync(sourcePath, backupPath);
            res.send({
                message: "Backup criado com sucesso",
                backup_file: backupFileName
            });
        }
        catch (error) {
            res.status(500).send({ error: "Erro ao criar backup" });
        }
    });
}
