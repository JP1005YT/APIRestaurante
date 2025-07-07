"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = __importDefault(require("../baseController"));
class TableControllerClass extends baseController_1.default {
    constructor() {
        super(); // Chama o construtor da classe base para inicializar a conexão
    }
    async getAllTables(req, res) {
        // res.send();
    }
}
exports.default = TableControllerClass;
