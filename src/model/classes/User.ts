import { UserInterface } from "../interfaces/UserInterface";

export default class User implements UserInterface{
    name: string;
    contact: string;
    adress: string;
    preferences?: string;
    purchase_his?: number[];

    constructor(name: string, contact: string, adress: string, preferences?: string, purchase_his?: number[]){
        this.name = name;
        this.contact = contact;
        this.adress = adress;
        this.preferences = preferences;
        this.purchase_his = purchase_his;
    }
}