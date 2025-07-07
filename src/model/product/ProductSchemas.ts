import { z } from "zod";

const ProductSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    price: z.number().positive("Preço deve ser positivo"),
    category: z.string().min(1, "Categoria é obrigatória"),
    image: z.string().url("URL da imagem deve ser válida").optional().or(z.literal(""))
});

const ProductUpdateSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").optional(),
    description: z.string().min(1, "Descrição é obrigatória").optional(),
    price: z.number().positive("Preço deve ser positivo").optional(),
    category: z.string().min(1, "Categoria é obrigatória").optional(),
    image: z.string().url("URL da imagem deve ser válida").optional().or(z.literal(""))
});

const ProductParamsSchema = z.object({
    id: z.string().min(1, "ID é obrigatório")
});

const ProductCategoryParamsSchema = z.object({
    category: z.string().min(1, "Categoria é obrigatória")
});

export default {
    getAll: () => ({
        schema: {
            tags: ["Products"],
            summary: "Buscar todos os produtos",
            response: {
                200: z.object({
                    products: z.array(ProductSchema)
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
                200: z.object({
                    product: ProductSchema
                }),
                404: z.object({
                    error: z.string()
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
                201: z.object({
                    message: z.string(),
                    product: ProductSchema
                }),
                500: z.object({
                    error: z.string()
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
            tags: ["Products"],
            summary: "Deletar produto",
            params: ProductParamsSchema,
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
    
    getByCategory: () => ({
        schema: {
            tags: ["Products"],
            summary: "Buscar produtos por categoria",
            params: ProductCategoryParamsSchema,
            response: {
                200: z.object({
                    products: z.array(ProductSchema)
                })
            }
        }
    })
};

