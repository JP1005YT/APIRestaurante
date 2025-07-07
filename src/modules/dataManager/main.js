"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class dataManager {
    sqlconn = new better_sqlite3_1.default('bd.db');
    jsonconn = fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'semiStaticData.json'), 'utf-8');
    Json() {
        return JSON.parse(this.jsonconn);
    }
    Sqlite() {
    }
    SyncData() {
        console.log("Syncing data");
        const data = this.Json();
        const tables = data.restaurant.tables;
        let i = 0;
        // while(tables > i){
        // }
    }
}
exports.dataManager = dataManager;
