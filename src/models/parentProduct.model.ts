import mongoose, {Schema} from "mongoose";
import {IParentProduct} from "../interfaces/parentproduct.interface";

const parentProductSchema = new Schema<IParentProduct>({
    name: String,
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' }, // Vendor koleksiyonuna referans
});

const ParentProductModel = mongoose.model<IParentProduct>('parnet_products', parentProductSchema);
export default ParentProductModel;