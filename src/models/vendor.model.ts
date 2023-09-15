import mongoose, {Schema} from "mongoose";
import {IVendor} from "../interfaces/vendor.interface";

const vendorSchema = new Schema<IVendor>({
    name: String,
});

const VendorModel = mongoose.model<IVendor>('vendors', vendorSchema);

export default VendorModel;