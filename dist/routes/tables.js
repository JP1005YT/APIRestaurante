"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tablesRoutes = tablesRoutes;
const TableSchemas_1 = __importDefault(require("../model/table/TableSchemas"));
const TableController_1 = __importDefault(require("../model/table/TableController"));
async function tablesRoutes(app) {
    const TableController = new TableController_1.default();
    app.get("/tables", TableSchemas_1.default.getAll(), (req, res) => { TableController.getAllTables(req, res); });
}
