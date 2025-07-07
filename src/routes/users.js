"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = usersRoutes;
const UserSchemas_1 = __importDefault(require("../model/user/UserSchemas"));
const UserController_1 = __importDefault(require("../model/user/UserController"));
const users = [];
async function usersRoutes(app) {
    const UserController = new UserController_1.default(users);
    app.get("/users", UserSchemas_1.default.getAll(), (req, res) => { UserController.getAllUsers(req, res); });
    app.get("/users/:id", UserSchemas_1.default.getOne(), (req, res) => { UserController.getUser(req, res); });
    app.post("/users", UserSchemas_1.default.createNew(), (req, res) => { UserController.createUser(req, res); });
    app.put("/users/:id", UserSchemas_1.default.update(), (req, res) => { UserController.updateUser(req, res); });
    app.delete("/users/:id", UserSchemas_1.default.delete(), (req, res) => { UserController.deleteUser(req, res); });
}
