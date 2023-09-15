import mongoose, {Schema} from "mongoose";
import {IOrder} from "../interfaces/order.interface";

const orderSchema = new Schema<IOrder>({
    cart_item: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'ParentProduct' },
            variantId: String,
            series: String,
            item_count: Number,
            quantity: Number,
            cogs: Number,
            price: Number,
            vendor_margin: Number,
            order_status: String,
        },
    ],
    payment_at: Date,
});

const OrderModel = mongoose.model<IOrder>('orders', orderSchema);

export default  OrderModel;