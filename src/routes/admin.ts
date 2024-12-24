import { FastifyTypedInstance } from "./../types";
import dataBaseManagerClass from "./../modules/localDataBaseJson/main";

const dataBaseManager = new dataBaseManagerClass();

export async function adminRoutes(app: FastifyTypedInstance){
    app.get("/admin/backup", async (req,res) => {
        res.send(await dataBaseManager.makeMergeData());
    });
}