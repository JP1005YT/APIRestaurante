import { FastifyTypedInstance } from "./../types";
import { UserInterface } from "../model/user/UserInterface";
import UsersSchemas from "../model/user/UserSchemas";
import UserControllerClass from "../model/user/UserController";

const users: UserInterface[] = [];

export async function usersRoutes(app: FastifyTypedInstance){
    
    const UserController = new UserControllerClass(users);

    app.get("/users", UsersSchemas.getAll(),(req,res) => { UserController.getAllUsers(req,res) });
    app.get("/users/:id",UsersSchemas.getOne(),(req,res) => { UserController.getUser(req,res) });

    app.post("/users",UsersSchemas.createNew(), (req,res) => { UserController.createUser(req,res) });

    app.put("/users/:id",UsersSchemas.update(),(req,res) => { UserController.updateUser(req,res) });

    app.delete("/users/:id",UsersSchemas.delete(),(req,res) => { UserController.deleteUser(req,res) });
    
}