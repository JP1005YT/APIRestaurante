import { FastifyTypedInstance } from "./../types";
import UsersSchemas from "../model/user/UserSchemas";
import UserControllerClass from "../model/user/UserController";

export async function usersRoutes(app: FastifyTypedInstance){
    // @ts-ignore - propriedade decorada em runtime
    const db = (app as any).db as import('better-sqlite3').Database;
    const UserController = new UserControllerClass(db);

    app.get("/users", UsersSchemas.getAll(),(req,res) => { UserController.getAllUsers(req,res) });
    app.get("/users/:id",UsersSchemas.getOne(),(req,res) => { UserController.getUser(req,res) });

    app.post("/users",UsersSchemas.createNew(), (req,res) => { UserController.createUser(req,res) });

    app.put("/users/:id",UsersSchemas.update(),(req,res) => { UserController.updateUser(req,res) });

    app.delete("/users/:id",UsersSchemas.delete(),(req,res) => { UserController.deleteUser(req,res) });
}