import {ICartItem} from "./cartitem.interface";

export interface IOrder extends Document {
    cart_item: ICartItem[];
    payment_at: Date;
}