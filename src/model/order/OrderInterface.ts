import { ProductInterface } from '../product/ProductInterface';

export interface OrderInterface{
    products : ProductInterface[];
    total : number;
    status : string;
}