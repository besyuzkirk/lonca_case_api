import { NextFunction, Request, Response } from "express";
import OrderModel from "../models/order.model";
import ParentProductModel from "../models/parentProduct.model";



export const calculateMonthlyRevenuesByVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vendorId, year } = req.query;

        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        const parentProducts = await ParentProductModel.find({ vendor: vendorId }).exec();

        const parentProductIds = parentProducts.map(product => product._id);


        const orders = await OrderModel.find({
            'cart_item': {
                $elemMatch: {
                    'product': { $in: parentProductIds },
                    'order_status': 'Reviewed'
                }
            },
            'payment_at': { $gte: startDate, $lte: endDate }
        }).exec();

        const salesByMonths = Array(12).fill(0);

        for (const order of orders) {
            for (const cartItem of order.cart_item) {
                const product = parentProducts.find(product => product._id.equals(cartItem.product && cartItem.product.toString()));

                if (product) {
                    const month = order.payment_at.getMonth();
                    salesByMonths[month] += cartItem.quantity;
                }
            }
        }

        res.status(200).json({ salesByMonths });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Sales Service Error'  });
    }
};

export const calculateSalesByVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendorId = req.params.vendorId;


        console.log(vendorId)
        const vendorSales = await OrderModel.aggregate([
            {
                $match: {
                    'cart_item.product': {
                        $in: await ParentProductModel.find({ vendor: vendorId }).distinct('_id'),
                    },
                },
            },
            {
                $unwind: '$cart_item',
            },
            {
                $group: {
                    _id: '$cart_item.product',
                    totalSales: {
                        $sum: '$cart_item.quantity',
                    },
                },
            },
            {
                $lookup: {
                    from: 'parnet_products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            {
                $unwind: '$productInfo',
            },
            {
                $project: {
                    productName: '$productInfo.name',
                    totalSales: 1,
                },
            },

        ]);

        const transformedSales = vendorSales.map((sale) => ({
            ...transformProductName(sale.productName),
            totalSales: sale.totalSales,
        }));
        res.status(200).json({ "data" : transformedSales });

    } catch (error) {
        res.status(500).json({ error: 'Hata: Satışlar alınamıyor.' });
    }
}

function transformProductName(productName: string): {
    productNumber: string;
    productName: string;
    productColor: string;
} {
    const productNameParts = productName.split(' - ');
    return {
        productNumber: productNameParts[0] || '',
        productName: productNameParts[1] || '',
        productColor: productNameParts[2] || '',
    };
}