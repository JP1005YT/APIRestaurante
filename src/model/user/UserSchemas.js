"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
class UsersSchemas {
    static getAll() {
        return {
            schema: {
                tags: ["users"],
                summary: "Get all users",
                response: {
                    200: zod_1.default.array(zod_1.default.object({
                        id: zod_1.default.string(),
                        name: zod_1.default.string(),
                        cpf: zod_1.default.string(),
                        rg: zod_1.default.string(),
                        contact: zod_1.default.string(),
                        adress: zod_1.default.string(),
                        isVerified: zod_1.default.boolean()
                    }))
                }
            }
        };
    }
    static getOne() {
        return {
            schema: {
                tags: ["users"],
                summary: "Get a single user",
                params: zod_1.default.object({
                    id: zod_1.default.string().nonempty()
                }),
                response: {
                    200: zod_1.default.object({
                        id: zod_1.default.string(),
                        name: zod_1.default.string(),
                        cpf: zod_1.default.string(),
                        rg: zod_1.default.string(),
                        contact: zod_1.default.string(),
                        adress: zod_1.default.string(),
                        isVerified: zod_1.default.boolean()
                    })
                }
            }
        };
    }
    static createNew() {
        return {
            schema: {
                tags: ["users"],
                summary: "Create a new user",
                body: zod_1.default.object({
                    name: zod_1.default.string().nonempty(),
                    cpf: zod_1.default.string().nonempty(),
                    rg: zod_1.default.string().nonempty(),
                    contact: zod_1.default.string().nonempty(),
                    adress: zod_1.default.string().nonempty(),
                    isVerified: zod_1.default.boolean()
                }),
                response: {
                    201: zod_1.default.null().describe("User created"),
                    400: zod_1.default.object({
                        message: zod_1.default.string().nonempty()
                    }).describe("Bad Request")
                }
            }
        };
    }
    static update() {
        return {
            schema: {
                tags: ["users"],
                summary: "Update a user",
                params: zod_1.default.object({
                    id: zod_1.default.string().nonempty()
                }),
                body: zod_1.default.object({
                    name: zod_1.default.string().optional(),
                    cpf: zod_1.default.string().optional(),
                    rg: zod_1.default.string().optional(),
                    contact: zod_1.default.string().optional(),
                    adress: zod_1.default.string().optional(),
                    isVerified: zod_1.default.boolean().optional()
                }),
                response: {
                    200: zod_1.default.object({
                        id: zod_1.default.string(),
                        name: zod_1.default.string(),
                        cpf: zod_1.default.string(),
                        rg: zod_1.default.string(),
                        contact: zod_1.default.string(),
                        adress: zod_1.default.string(),
                        isVerified: zod_1.default.boolean()
                    }).describe("User updated"),
                    400: zod_1.default.object({
                        error: zod_1.default.boolean().default(true),
                        message: zod_1.default.string().nonempty()
                    }).describe("Bad Request")
                }
            }
        };
    }
    static delete() {
        return {
            schema: {
                tags: ["users"],
                summary: "Delete a user",
                params: zod_1.default.object({
                    id: zod_1.default.string().nonempty()
                }),
                response: {
                    200: zod_1.default.null().describe("User deleted"),
                    400: zod_1.default.object({
                        message: zod_1.default.string().nonempty()
                    }).describe("Bad Request")
                }
            }
        };
    }
}
exports.default = UsersSchemas;
