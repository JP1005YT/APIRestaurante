"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRoutes = ordersRoutes;
const OrderSchemas_1 = __importDefault(require("../model/order/OrderSchemas"));
const OrderController_1 = __importDefault(require("../model/order/OrderController"));
async function ordersRoutes(app) {
    const OrderController = new OrderController_1.default();
    app.get("/orders", OrderSchemas_1.default.getAll(), (req, res) => {
        OrderController.getAllOrders(req, res);
    });
    app.get("/orders/:id", OrderSchemas_1.default.getById(), (req, res) => {
        OrderController.getOrderById(req, res);
    });
    app.post("/orders", OrderSchemas_1.default.create(), (req, res) => {
        OrderController.createOrder(req, res);
    });
    app.put("/orders/:id/status", OrderSchemas_1.default.updateStatus(), (req, res) => {
        OrderController.updateOrderStatus(req, res);
    });
    app.delete("/orders/:id", OrderSchemas_1.default.delete(), (req, res) => {
        OrderController.deleteOrder(req, res);
    });
    app.get("/orders/table/:table_id", OrderSchemas_1.default.getByTable(), (req, res) => {
        OrderController.getOrdersByTable(req, res);
    });
    app.get("/orders/status/:status", OrderSchemas_1.default.getByStatus(), (req, res) => {
        OrderController.getOrdersByStatus(req, res);
    });
}
