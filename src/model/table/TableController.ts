import { TableInterface } from "./TableInterface";
import { dataManager } from "../../modules/dataManager/main";

import { FastifyReply, FastifyRequest } from "fastify";
import BaseController from "../baseController";

export default class TableControllerClass extends BaseController{

    constructor() {
        super(); // Chama o construtor da classe base para inicializar a conexão
    }
    
    public async getAllTables(req : FastifyRequest,res : FastifyReply){
        // res.send();
    }
}