import { OrderInterface } from "./../order/OrderInterface";

export interface TableInterface{
    id : string;
    // Mesa pode não ter um usuário
    user_id? : string;
    order? : OrderInterface;
}