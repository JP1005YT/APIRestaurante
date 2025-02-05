import { UserInterface } from "./UserInterface";

import { randomUUID } from "node:crypto";
import { FastifyReply, FastifyRequest } from "fastify";


export default class UserController{
    
    private users : UserInterface[] = [];
    
    constructor(users : UserInterface[]){
        this.users =  users
    }

    public async getAllUsersInfra(){
        return this.users;
    }

    public async getAllUsers(req : FastifyRequest ,res : FastifyReply){
        res.send(this.users);
    }

    public getUser(req : FastifyRequest ,res : FastifyReply){
        const { id } = req.params as { id: string };
        const user = this.users.find(user => user.id === id);
        if(!user){
            return res.status(404).send();
        }
        return res.send(user);
    }

    public async createUser(req : FastifyRequest ,res : FastifyReply){

        const {name,rg,cpf, contact, adress , isVerified } = req.body as { name: string; cpf:string; rg:string; contact: string; adress: string; isVerified : boolean; };

        this.users.push({
            id: randomUUID(),
            name,
            cpf,
            rg,
            contact,
            adress,
            isVerified,
        });

        return res.status(201).send()
    }
    public async updateUser(req : FastifyRequest ,res : FastifyReply){
        res.send(this.users[0])
    }
    public async deleteUser(req : FastifyRequest ,res : FastifyReply){

    }
}