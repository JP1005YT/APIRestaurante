import { FastifyTypedInstance } from "./../types";
import { UserInterface } from "../model/user/UserInterface";
import UsersSchemas from "../model/user/UserSchemas";
import UserControllerClass from "../model/user/UserController";
import dataBaseManagerClass from "./../modules/localDataBaseJson/main";

const users: UserInterface[] = [];
const dataBaseManager = new dataBaseManagerClass();

async function getAllUsers(): Promise<UserInterface[]> {
    const data = await dataBaseManager.getData("users");
    return data
}

export async function usersRoutes(app: FastifyTypedInstance){
    
    const dataBaseUsers = await getAllUsers();
    users.push(...dataBaseUsers);
    const UserController = new UserControllerClass(users);
    dataBaseManager.useFlashData("users",await UserController.getAllUsersInfra());

    app.get("/users", (req,res) => { UserController.getAllUsers(req,res) });
    app.get("/users/:id",UsersSchemas.getOne(),(req,res) => { UserController.getUser(req,res) });

    app.post("/users",UsersSchemas.createNew(), (req,res) => { UserController.createUser(req,res) });
}