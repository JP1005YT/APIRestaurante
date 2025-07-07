import { z } from "zod";

const OrderProductSchema = z.object({
    product_id: z.string().min(1, "ID do produto é obrigatório"),
    quantity: z.number().int().positive("Quantidade deve ser um número positivo")
});

const CreateOrderSchema = z.object({
    table_id: z.string().min(1, "ID da mesa é obrigatório"),
    products: z.array(OrderProductSchema).min(1, "Pelo menos um produto deve ser incluído")
});

const UpdateOrderStatusSchema = z.object({
    status: z.enum(["pending", "preparing", "ready", "delivered", "cancelled"], {
        errorMap: () => ({ message: "Status deve ser: pending, preparing, ready, delivered ou cancelled" })
    })
});

const OrderParamsSchema = z.object({
    id: z.string().min(1, "ID é obrigatório")
});

const TableParamsSchema = z.object({
    table_id: z.string().min(1, "ID da mesa é obrigatório")
});

const StatusParamsSchema = z.object({
    status: z.enum(["pending", "preparing", "ready", "delivered", "cancelled"])
});

const OrderResponseSchema = z.object({
    id: z.string(),
    table_id: z.string(),
    total: z.number(),
    status: z.string(),
    created_at: z.string().optional(),
    products_info: z.string().optional()
});

export default {
    getAll: () => ({
        schema: {
            tags: ["Orders"],
            summary: "Buscar todos os pedidos",
            response: {
                200: z.object({
                    orders: z.array(OrderResponseSchema)
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
                200: z.object({
                    order: OrderResponseSchema
                }),
                404: z.object({
                    error: z.string()
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
                201: z.object({
                    message: z.string(),
                    order: z.object({
                        id: z.string(),
                        table_id: z.string(),
                        total: z.number(),
                        status: z.string()
                    })
                }),
                500: z.object({
                    error: z.string()
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
                200: z.object({
                    message: z.string()
                }),
                404: z.object({
                    error: z.string()
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
                200: z.object({
                    message: z.string()
                }),
                404: z.object({
                    error: z.string()
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
                200: z.object({
                    orders: z.array(OrderResponseSchema)
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
                200: z.object({
                    orders: z.array(OrderResponseSchema)
                })
            }
        }
    })
};

