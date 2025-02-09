import { dataManager } from "../modules/dataManager/main";

export default class BaseController {
    protected db

    constructor() {
        this.db = new dataManager();
    }
}
