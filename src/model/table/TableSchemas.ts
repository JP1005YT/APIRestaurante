import z, { Schema } from "zod";

export default abstract class TableSchemas {
    static getAll() {
        return {
            schema: {
                tags: ["tables"],
                summary: "Get all tables",
                response: {
                    200: z.array(z.object({
                        id: z.string(),
                        user_id: z.string().optional(),
                        order: z.object({
                            id: z.string(),
                            table_id: z.string(),
                            status: z.string(),
                            total_price: z.number()
                        }).optional()
                    }))
                }
            }
        }
    }
}