"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
class UserController {
    users = [];
    constructor(users) {
        this.users = users;
    }
    async getAllUsersInfra() {
        return this.users;
    }
    async getAllUsers(req, res) {
        res.send(this.users);
    }
    getUser(req, res) {
        const { id } = req.params;
        const user = this.users.find(user => user.id === id);
        if (!user) {
            return res.status(404).send();
        }
        return res.send(user);
    }
    async createUser(req, res) {
        const { name, rg, cpf, contact, adress, isVerified } = req.body;
        this.users.push({
            id: (0, node_crypto_1.randomUUID)(),
            name,
            cpf,
            rg,
            contact,
            adress,
            isVerified,
        });
        return res.status(201).send();
    }
    async updateUser(req, res) {
        res.send(this.users[0]);
    }
    async deleteUser(req, res) {
    }
}
exports.default = UserController;
