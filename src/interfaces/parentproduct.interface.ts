import {Types} from "mongoose";
import {IVendor} from "./vendor.interface";

export interface IParentProduct extends Document {
    name: string;
    vendor: Types.ObjectId | IVendor;
}

export { Types }