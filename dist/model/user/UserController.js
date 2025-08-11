"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
class UserController {
    db;
    constructor(db) {
        this.db = db;
    }
    rowToUser(row) {
        return {
            id: row.id,
            name: row.name,
            cpf: row.cpf,
            rg: row.rg,
            contact: row.contact,
            adress: row.adress,
            isVerified: !!row.isVerified,
        };
    }
    async getAllUsersInfra() {
        const rows = this.db.prepare("SELECT id, name, cpf, rg, contact, adress, isVerified FROM users").all();
        return rows.map((r) => this.rowToUser(r));
    }
    async getAllUsers(req, res) {
        const users = await this.getAllUsersInfra();
        res.send(users);
    }
    getUser(req, res) {
        const { id } = req.params;
        const row = this.db.prepare("SELECT id, name, cpf, rg, contact, adress, isVerified FROM users WHERE id = ?").get(id);
        if (!row) {
            return res.status(404).send();
        }
        return res.send(this.rowToUser(row));
    }
    async createUser(req, res) {
        try {
            const { name, rg, cpf, contact, adress, isVerified } = req.body;
            const id = (0, node_crypto_1.randomUUID)();
            this.db.prepare(`
                INSERT INTO users (id, name, cpf, rg, contact, adress, isVerified)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(id, name, cpf, rg, contact, adress, isVerified ? 1 : 0);
            return res.status(201).send();
        }
        catch (err) {
            return res.status(400).send({ message: err?.message ?? 'Erro ao criar usuário' });
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const existing = this.db.prepare("SELECT * FROM users WHERE id = ?").get(id);
            if (!existing) {
                return res.status(400).send({ error: true, message: 'Usuário não encontrado' });
            }
            const body = req.body;
            const updated = {
                id,
                name: body.name ?? existing.name,
                cpf: body.cpf ?? existing.cpf,
                rg: body.rg ?? existing.rg,
                contact: body.contact ?? existing.contact,
                adress: body.adress ?? existing.adress,
                isVerified: body.isVerified ?? !!existing.isVerified,
            };
            this.db.prepare(`
                UPDATE users SET name = ?, cpf = ?, rg = ?, contact = ?, adress = ?, isVerified = ?
                WHERE id = ?
            `).run(updated.name, updated.cpf, updated.rg, updated.contact, updated.adress, updated.isVerified ? 1 : 0, id);
            return res.send(updated);
        }
        catch (err) {
            return res.status(400).send({ error: true, message: err?.message ?? 'Erro ao atualizar usuário' });
        }
    }
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = this.db.prepare("DELETE FROM users WHERE id = ?").run(id);
            if (result.changes === 0) {
                return res.status(400).send({ message: 'Usuário não encontrado' });
            }
            return res.send(null);
        }
        catch (err) {
            return res.status(400).send({ message: err?.message ?? 'Erro ao deletar usuário' });
        }
    }
}
exports.default = UserController;
