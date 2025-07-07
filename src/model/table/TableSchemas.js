"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
class TableSchemas {
    static getAll() {
        return {
            schema: {
                tags: ["tables"],
                summary: "Get all tables",
                response: {
                    200: zod_1.default.array(zod_1.default.object({
                        id: zod_1.default.string(),
                        user_id: zod_1.default.string().optional(),
                        order: zod_1.default.object({
                            id: zod_1.default.string(),
                            table_id: zod_1.default.string(),
                            status: zod_1.default.string(),
                            total_price: zod_1.default.number()
                        }).optional()
                    }))
                }
            }
        };
    }
}
exports.default = TableSchemas;
