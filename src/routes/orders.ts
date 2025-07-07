import { FastifyTypedInstance } from "../types";
import OrderSchemas from "../model/order/OrderSchemas";
import OrderControllerClass from "../model/order/OrderController";

export async function ordersRoutes(app: FastifyTypedInstance){
    
    const OrderController = new OrderControllerClass();

    app.get("/orders", OrderSchemas.getAll(), (req, res) => { 
        OrderController.getAllOrders(req, res) 
    });
    
    app.get("/orders/:id", OrderSchemas.getById(), (req, res) => { 
        OrderController.getOrderById(req, res) 
    });
    
    app.post("/orders", OrderSchemas.create(), (req, res) => { 
        OrderController.createOrder(req, res) 
    });
    
    app.put("/orders/:id/status", OrderSchemas.updateStatus(), (req, res) => { 
        OrderController.updateOrderStatus(req, res) 
    });
    
    app.delete("/orders/:id", OrderSchemas.delete(), (req, res) => { 
        OrderController.deleteOrder(req, res) 
    });
    
    app.get("/orders/table/:table_id", OrderSchemas.getByTable(), (req, res) => { 
        OrderController.getOrdersByTable(req, res) 
    });
    
    app.get("/orders/status/:status", OrderSchemas.getByStatus(), (req, res) => { 
        OrderController.getOrdersByStatus(req, res) 
    });
}

