import {Types} from "mongoose";
import {IParentProduct} from "./parentproduct.interface";

export interface ICartItem {
    product: Types.ObjectId | IParentProduct;
    variantId: string;
    series: string;
    item_count: number;
    quantity: number;
    cogs: number;
    price: number;
    vendor_margin: number;
    order_status: string;
}
