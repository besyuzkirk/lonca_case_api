import { NextFunction, Request, Response } from "express";
import VendorModel from "../models/vendor.model";
import ParentProductModel from "../models/parentProduct.model";
import OrderModel from "../models/order.model";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export const verifyVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vendorId } = req.params;

        if(!isObjectId(vendorId)) {
            res.status(500).json({ error: 'Vendor cannot found'  });
            return
        }


        const vendor = await VendorModel.findOne({ _id: new mongoose.Types.ObjectId(vendorId) }).exec();

        console.log(vendor)


        res.status(200).json({ vendor });


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Vendor cannot found'  });
    }
};

function isObjectId(value : string) {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(value);
}