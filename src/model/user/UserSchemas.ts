import z, { Schema } from "zod";

export default abstract class UsersSchemas{
        static getAll(){
            return {
                schema: {
                    tags: ["users"],
                    summary: "Get all users",
                    response: {
                        200: z.array(z.object({
                            id: z.string(),
                            name: z.string(),
                            adress: z.string(),
                            contact: z.string(),
                            preferences: z.string().optional(),
                            purchase_his: z.array(z.number()).optional()
                        }))
                    }
                }
            }
        }
        static getOne(){
            return {
                schema : {
                    tags: ["users"],
                    summary: "Get a single user",
                    params: z.object({
                        id: z.string().nonempty()
                    }),
                    response: {
                        200: z.object({
                            id: z.string(),
                            name: z.string(),
                            adress: z.string(),
                            contact: z.string(),
                            preferences: z.string().optional(),
                            purchase_his: z.array(z.number()).optional()
                        })
                    }
                }
            }
        }
        static createNew(){
            return {
                schema: {
                    tags: ["users"],
                    summary: "Create a new user",
                    body: z.object({
                        name: z.string().nonempty(),
                        contact: z.string().nonempty(),
                        adress: z.string().nonempty()
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
        static update(){
            return {
                schema: {
                    tags: ["users"],
                    summary: "Update a user",
                    params: z.object({
                        id: z.string().nonempty()
                    }),
                    response: {
                        200: z.object({
                            id: z.string(),
                            name: z.string(),
                            adress: z.string(),
                            contact: z.string(),
                            preferences: z.string().optional(),
                            purchase_his: z.array(z.number()).optional()
                        }).describe("User updated"),
                        400: z.object({
                            error : z.boolean().default(true),
                            message: z.string().nonempty()
                        }).describe("Bad Request")
                    }
                }
            }
        }

        static delete(){
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