import { FastifyTypedInstance } from "../types";
import { TableInterface } from "../model/table/TableInterface";
import TableSchemas from "../model/table/TableSchemas";
import TableControllerClass from "../model/table/TableController";

export async function tablesRoutes(app: FastifyTypedInstance){
    
    const TableController = new TableControllerClass();

    app.get("/tables", TableSchemas.getAll(),(req,res) => { TableController.getAllTables(req,res) });
}