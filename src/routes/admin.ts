import { FastifyTypedInstance } from "./../types";
import { z } from "zod";

export async function adminRoutes(app: FastifyTypedInstance){

    // Rota para obter estatísticas gerais do restaurante
    app.get("/admin/stats", {
        schema: {
            tags: ["Admin"],
            summary: "Obter estatísticas do restaurante",
            response: {
                200: z.object({
                    totalOrders: z.number(),
                    totalRevenue: z.number(),
                    totalTables: z.number(),
                    totalProducts: z.number(),
                    ordersByStatus: z.record(z.number())
                }),
                500: z.object({
                    error: z.string()
                })
            }
        }
    }, async (req, res) => {
        try {
            const db = (req.server as any).db as import('better-sqlite3').Database;
            
            const totalOrders = (db.prepare("SELECT COUNT(*) as count FROM orders").get() as {count?: number} | undefined)?.count || 0;
            const totalRevenue = (db.prepare("SELECT SUM(total) as sum FROM orders WHERE status = 'delivered'").get() as {sum?: number} | undefined)?.sum || 0;
            const totalTables = (db.prepare("SELECT COUNT(*) as count FROM tables").get() as {count?: number} | undefined)?.count || 0;
            const totalProducts = (db.prepare("SELECT COUNT(*) as count FROM products").get() as {count?: number} | undefined)?.count || 0;
            
            const ordersByStatusResult = db.prepare(`
                SELECT status, COUNT(*) as count 
                FROM orders 
                GROUP BY status
            `).all() as Array<{status: string; count: number}>;
            
            const ordersByStatus: Record<string, number> = {};
            ordersByStatusResult.forEach((row: any) => {
                ordersByStatus[row.status] = row.count;
            });
            
            res.send({
                totalOrders,
                totalRevenue,
                totalTables,
                totalProducts,
                ordersByStatus
            });
        } catch (error) {
            res.status(500).send({ error: "Erro ao buscar estatísticas" });
        }
    });

    // Rota para obter relatório de vendas por período
    app.get("/admin/sales-report", {
        schema: {
            tags: ["Admin"],
            summary: "Relatório de vendas por período",
            querystring: z.object({
                start_date: z.string().optional(),
                end_date: z.string().optional()
            }),
            response: {
                200: z.object({
                    totalSales: z.number(),
                    orderCount: z.number(),
                    averageOrderValue: z.number(),
                    topProducts: z.array(z.object({
                        product_name: z.string(),
                        quantity_sold: z.number(),
                        revenue: z.number()
                    }))
                }),
                500: z.object({
                    error: z.string()
                })
            }
        }
    }, async (req, res) => {
        try {
            const { start_date, end_date } = req.query as { start_date?: string, end_date?: string };
            const db = (req.server as any).db as import('better-sqlite3').Database;
            
            let dateFilter = "";
            const params: any[] = [];
            
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
            `).get(...params) as { totalSales?: number; orderCount?: number; averageOrderValue?: number } | undefined;
            
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
            `).all(...params) as Array<{ product_name: string; quantity_sold: number; revenue: number }>;
            
            res.send({
                totalSales: salesData?.totalSales || 0,
                orderCount: salesData?.orderCount || 0,
                averageOrderValue: salesData?.averageOrderValue || 0,
                topProducts: topProducts || []
            });
        } catch (error) {
            res.status(500).send({ error: "Erro ao gerar relatório de vendas" });
        }
    });

    // Rota para backup do banco de dados
    app.post("/admin/backup", {
        schema: {
            tags: ["Admin"],
            summary: "Criar backup do banco de dados",
            response: {
                200: z.object({
                    message: z.string(),
                    backup_file: z.string()
                }),
                500: z.object({
                    error: z.string()
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
        } catch (error) {
            res.status(500).send({ error: "Erro ao criar backup" });
        }
    });
}