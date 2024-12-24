import fs from 'fs';
import path from 'path';

export default class DataBaseManager {
    private dataBasePath: string;
    private flashDataPath: string;
    private dataBase: any;

    constructor(){
        this.dataBasePath = path.resolve(__dirname, './data/dataBase.json');
        this.flashDataPath = path.resolve(__dirname, './flash/');
        this.dataBase = fs.readFileSync(this.dataBasePath);
    }

    async getData(module : string){
        return await JSON.parse(this.dataBase)[module];
    }

    async useFlashData(module : string,data : object){
        setInterval(async () => {
            console.log(`${module} flash data saved`);
            fs.writeFileSync(path.resolve(this.flashDataPath, './' + module + '.json'),JSON.stringify(data));
        }, 3600 * 1000)
        // Auto save flash data every hour
    }

    async makeMergeData(){
        const flashData = fs.readdirSync(this.flashDataPath);
        const dataBase = JSON.parse(this.dataBase);
        const newDataBase: { [key: string]: any[] } = {};
        flashData.forEach(async (file) => {
            const module = file.split(".")[0];
            const flashDataContent = await JSON.parse(fs.readFileSync(path.resolve(this.flashDataPath , "./" + file)).toString());
            newDataBase[module]= flashDataContent;
            fs.unlinkSync(path.resolve(this.flashDataPath , "./" + file));
        })

        setTimeout(() => {
            fs.writeFileSync(this.dataBasePath,JSON.stringify(newDataBase));
        }, 5000)
    }
}