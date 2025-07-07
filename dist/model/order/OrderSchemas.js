"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const OrderProductSchema = zod_1.z.object({
    product_id: zod_1.z.string().min(1, "ID do produto é obrigatório"),
    quantity: zod_1.z.number().int().positive("Quantidade deve ser um número positivo")
});
const CreateOrderSchema = zod_1.z.object({
    table_id: zod_1.z.string().min(1, "ID da mesa é obrigatório"),
    products: zod_1.z.array(OrderProductSchema).min(1, "Pelo menos um produto deve ser incluído")
});
const UpdateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["pending", "preparing", "ready", "delivered", "cancelled"], {
        errorMap: () => ({ message: "Status deve ser: pending, preparing, ready, delivered ou cancelled" })
    })
});
const OrderParamsSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "ID é obrigatório")
});
const TableParamsSchema = zod_1.z.object({
    table_id: zod_1.z.string().min(1, "ID da mesa é obrigatório")
});
const StatusParamsSchema = zod_1.z.object({
    status: zod_1.z.enum(["pending", "preparing", "ready", "delivered", "cancelled"])
});
const OrderResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    table_id: zod_1.z.string(),
    total: zod_1.z.number(),
    status: zod_1.z.string(),
    created_at: zod_1.z.string().optional(),
    products_info: zod_1.z.string().optional()
});
exports.default = {
    getAll: () => ({
        schema: {
            tags: ["Orders"],
            summary: "Buscar todos os pedidos",
            response: {
                200: zod_1.z.object({
                    orders: zod_1.z.array(OrderResponseSchema)
                })
            }
        }
    }),
    getById: () => ({
        schema: {
            tags: ["Orders"],
            summary: "Buscar pedido por ID",
            params: OrderParamsSchema,
            response: {
                200: zod_1.z.object({
                    order: OrderResponseSchema
                }),
                404: zod_1.z.object({
                    error: zod_1.z.string()
                })
            }
        }
    }),
    create: () => ({
        schema: {
            tags: ["Orders"],
            summary: "Criar novo pedido",
            body: CreateOrderSchema,
            response: {
                201: zod_1.z.object({
                    message: zod_1.z.string(),
                    order: zod_1.z.object({
                        id: zod_1.z.string(),
                        table_id: zod_1.z.string(),
                        total: zod_1.z.number(),
                        status: zod_1.z.string()
                    })
                }),
                500: zod_1.z.object({
                    error: zod_1.z.string()
                })
            }
        }
    }),
    updateStatus: () => ({
        schema: {
            tags: ["Orders"],
            summary: "Atualizar status do pedido",
            params: OrderParamsSchema,
            body: UpdateOrderStatusSchema,
            response: {
                200: zod_1.z.object({
                    message: zod_1.z.string()
                }),
                404: zod_1.z.object({
                    error: zod_1.z.string()
                })
            }
        }
    }),
    delete: () => ({
        schema: {
            tags: ["Orders"],
            summary: "Deletar pedido",
            params: OrderParamsSchema,
            response: {
                200: zod_1.z.object({
                    message: zod_1.z.string()
                }),
                404: zod_1.z.object({
                    error: zod_1.z.string()
                })
            }
        }
    }),
    getByTable: () => ({
        schema: {
            tags: ["Orders"],
            summary: "Buscar pedidos por mesa",
            params: TableParamsSchema,
            response: {
                200: zod_1.z.object({
                    orders: zod_1.z.array(OrderResponseSchema)
                })
            }
        }
    }),
    getByStatus: () => ({
        schema: {
            tags: ["Orders"],
            summary: "Buscar pedidos por status",
            params: StatusParamsSchema,
            response: {
                200: zod_1.z.object({
                    orders: zod_1.z.array(OrderResponseSchema)
                })
            }
        }
    })
};
