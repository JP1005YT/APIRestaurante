"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ProductSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "ID é obrigatório"),
    name: zod_1.z.string().min(1, "Nome é obrigatório"),
    description: zod_1.z.string().min(1, "Descrição é obrigatória"),
    price: zod_1.z.number().positive("Preço deve ser positivo"),
    category: zod_1.z.string().min(1, "Categoria é obrigatória"),
    image: zod_1.z.string().url("URL da imagem deve ser válida").optional().or(zod_1.z.literal(""))
});
const ProductUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Nome é obrigatório").optional(),
    description: zod_1.z.string().min(1, "Descrição é obrigatória").optional(),
    price: zod_1.z.number().positive("Preço deve ser positivo").optional(),
    category: zod_1.z.string().min(1, "Categoria é obrigatória").optional(),
    image: zod_1.z.string().url("URL da imagem deve ser válida").optional().or(zod_1.z.literal(""))
});
const ProductParamsSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "ID é obrigatório")
});
const ProductCategoryParamsSchema = zod_1.z.object({
    category: zod_1.z.string().min(1, "Categoria é obrigatória")
});
exports.default = {
    getAll: () => ({
        schema: {
            tags: ["Products"],
            summary: "Buscar todos os produtos",
            response: {
                200: zod_1.z.object({
                    products: zod_1.z.array(ProductSchema)
                })
            }
        }
    }),
    getById: () => ({
        schema: {
            tags: ["Products"],
            summary: "Buscar produto por ID",
            params: ProductParamsSchema,
            response: {
                200: zod_1.z.object({
                    product: ProductSchema
                }),
                404: zod_1.z.object({
                    error: zod_1.z.string()
                })
            }
        }
    }),
    create: () => ({
        schema: {
            tags: ["Products"],
            summary: "Criar novo produto",
            body: ProductSchema,
            response: {
                201: zod_1.z.object({
                    message: zod_1.z.string(),
                    product: ProductSchema
                }),
                500: zod_1.z.object({
                    error: zod_1.z.string()
                })
            }
        }
    }),
    update: () => ({
        schema: {
            tags: ["Products"],
            summary: "Atualizar produto",
            params: ProductParamsSchema,
            body: ProductUpdateSchema,
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
            tags: ["Products"],
            summary: "Deletar produto",
            params: ProductParamsSchema,
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
    getByCategory: () => ({
        schema: {
            tags: ["Products"],
            summary: "Buscar produtos por categoria",
            params: ProductCategoryParamsSchema,
            response: {
                200: zod_1.z.object({
                    products: zod_1.z.array(ProductSchema)
                })
            }
        }
    })
};
