"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../modules/dataManager/main");
class BaseController {
    db;
    constructor() {
        const dbManager = new main_1.dataManager();
        this.db = dbManager.Sqlite();
    }
}
exports.default = BaseController;
