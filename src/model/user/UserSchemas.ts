import z, { Schema } from "zod";

export default abstract class UsersSchemas {
    static getAll() {
        return {
            schema: {
                tags: ["users"],
                summary: "Get all users",
                response: {
                    200: z.array(z.object({
                        id: z.string(),
                        name: z.string(),
                        cpf: z.string(),
                        rg: z.string(),
                        contact: z.string(),
                        adress: z.string(),
                        isVerified: z.boolean()
                    }))
                }
            }
        }
    }

    static getOne() {
        return {
            schema: {
                tags: ["users"],
                summary: "Get a single user",
                params: z.object({
                    id: z.string().nonempty()
                }),
                response: {
                    200: z.object({
                        id: z.string(),
                        name: z.string(),
                        cpf: z.string(),
                        rg: z.string(),
                        contact: z.string(),
                        adress: z.string(),
                        isVerified: z.boolean()
                    })
                }
            }
        }
    }

    static createNew() {
        return {
            schema: {
                tags: ["users"],
                summary: "Create a new user",
                body: z.object({
                    name: z.string().nonempty(),
                    cpf: z.string().nonempty(),
                    rg: z.string().nonempty(),
                    contact: z.string().nonempty(),
                    adress: z.string().nonempty(),
                    isVerified: z.boolean()
                }),
                response: {
                    201: z.null().describe("User created"),
                    400: z.object({
                        message: z.string().nonempty()
                    }).describe("Bad Request")
                }
            }
        }
    }

    static update() {
        return {
            schema: {
                tags: ["users"],
                summary: "Update a user",
                params: z.object({
                    id: z.string().nonempty()
                }),
                body: z.object({
                    name: z.string().optional(),
                    cpf: z.string().optional(),
                    rg: z.string().optional(),
                    contact: z.string().optional(),
                    adress: z.string().optional(),
                    isVerified: z.boolean().optional()
                }),
                response: {
                    200: z.object({
                        id: z.string(),
                        name: z.string(),
                        cpf: z.string(),
                        rg: z.string(),
                        contact: z.string(),
                        adress: z.string(),
                        isVerified: z.boolean()
                    }).describe("User updated"),
                    400: z.object({
                        error: z.boolean().default(true),
                        message: z.string().nonempty()
                    }).describe("Bad Request")
                }
            }
        }
    }

    static delete() {
        return {
            schema: {
                tags: ["users"],
                summary: "Delete a user",
                params: z.object({
                    id: z.string().nonempty()
                }),
                response: {
                    200: z.null().describe("User deleted"),
                    400: z.object({
                        message: z.string().nonempty()
                    }).describe("Bad Request")
                }
            }
        }
    }
}