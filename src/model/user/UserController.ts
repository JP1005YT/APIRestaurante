import { UserInterface } from "./UserInterface";
import { randomUUID } from "node:crypto";
import { FastifyReply, FastifyRequest } from "fastify";
// Tipar a instância do banco sem conflitos de módulo
type BetterSqliteDB = import('better-sqlite3').Database;

export default class UserController{
    private db: BetterSqliteDB;

    constructor(db: BetterSqliteDB){
        this.db = db;
    }

    private rowToUser(row: any): UserInterface{
        return {
            id: row.id,
            name: row.name,
            cpf: row.cpf,
            rg: row.rg,
            contact: row.contact,
            adress: row.adress,
            isVerified: !!row.isVerified,
        }
    }

    public async getAllUsersInfra(){
    const rows = this.db.prepare("SELECT id, name, cpf, rg, contact, adress, isVerified FROM users").all() as any[];
    return rows.map((r: any) => this.rowToUser(r));
    }

    public async getAllUsers(req : FastifyRequest ,res : FastifyReply){
        const users = await this.getAllUsersInfra();
        res.send(users);
    }

    public getUser(req : FastifyRequest ,res : FastifyReply){
        const { id } = req.params as { id: string };
        const row = this.db.prepare("SELECT id, name, cpf, rg, contact, adress, isVerified FROM users WHERE id = ?").get(id);
        if(!row){
            return res.status(404).send();
        }
        return res.send(this.rowToUser(row));
    }

    public async createUser(req : FastifyRequest ,res : FastifyReply){
        try{
            const {name,rg,cpf, contact, adress , isVerified } = req.body as { name: string; cpf:string; rg:string; contact: string; adress: string; isVerified : boolean; };
            const id = randomUUID();
            this.db.prepare(`
                INSERT INTO users (id, name, cpf, rg, contact, adress, isVerified)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(id, name, cpf, rg, contact, adress, isVerified ? 1 : 0);
            return res.status(201).send();
        }catch(err: any){
            return res.status(400).send({ message: err?.message ?? 'Erro ao criar usuário' });
        }
    }

    public async updateUser(req : FastifyRequest ,res : FastifyReply){
        try{
            const { id } = req.params as { id: string };
            const existing = this.db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any;
            if(!existing){
                return res.status(400).send({ error: true, message: 'Usuário não encontrado' });
            }
            const body = req.body as Partial<Pick<UserInterface,'name'|'cpf'|'rg'|'contact'|'adress'|'isVerified'>>;
            const updated: UserInterface = {
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
        }catch(err: any){
            return res.status(400).send({ error: true, message: err?.message ?? 'Erro ao atualizar usuário' });
        }
    }

    public async deleteUser(req : FastifyRequest ,res : FastifyReply){
        try{
            const { id } = req.params as { id: string };
            const result = this.db.prepare("DELETE FROM users WHERE id = ?").run(id);
            if(result.changes === 0){
                return res.status(400).send({ message: 'Usuário não encontrado' });
            }
            return res.send(null);
        }catch(err: any){
            return res.status(400).send({ message: err?.message ?? 'Erro ao deletar usuário' });
        }
    }
}