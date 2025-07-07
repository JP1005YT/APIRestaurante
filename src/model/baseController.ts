import { dataManager } from "../modules/dataManager/main";

export default class BaseController {
    protected db: any;

    constructor() {
        const dbManager = new dataManager();
        this.db = dbManager.Sqlite();
    }
}
