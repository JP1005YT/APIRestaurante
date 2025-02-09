import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

export class dataManager{
    public sqlconn = new Database('bd.db');
    public jsonconn = fs.readFileSync(path.resolve(__dirname, 'semiStaticData.json'), 'utf-8');


    public Json(){
        return JSON.parse(this.jsonconn);
    }

    public Sqlite(){

    }
    public SyncData(){
        console.log("Syncing data");

        const data = this.Json();
        const tables = data.restaurant.tables

        let i = 0;
        // while(tables > i){

        // }
    }
}