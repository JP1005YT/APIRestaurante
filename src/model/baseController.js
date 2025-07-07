"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../modules/dataManager/main");
class BaseController {
    db;
    constructor() {
        this.db = new main_1.dataManager();
    }
}
exports.default = BaseController;
