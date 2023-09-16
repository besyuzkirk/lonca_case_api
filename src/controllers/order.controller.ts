import { NextFunction, Request, Response } from "express";
import OrderModel from "../models/order.model";
import ParentProductModel from "../models/parentProduct.model";



export const calculateMonthlyRevenuesByVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vendorId, year } = req.query;

        if (!vendorId || !year) {
            return res.status(400).json({ error: "vendorId ve year must" });
        }

        const parentProducts = await ParentProductModel.find({ vendor: vendorId }).exec();
        const parentProductIds = parentProducts.map(product => product._id);

        const allSales = await OrderModel.aggregate([
            {
                $unwind: "$cart_item"
            },
            {
                $addFields: {
                    "cart_item.order_payment_at": "$payment_at"
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$cart_item"
                }
            }
        ])

        const vendorSales = allSales.filter(sale => {
            return parentProductIds.some(productId => productId.equals(sale.product));
        });

        const salesByMonths = calculateMonthlySales(vendorSales, year.toString())

        res.status(200).json({ salesByMonths });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Sales Service Error'  });
    }
};

export const calculateSalesByVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendorId = req.params.vendorId;

        // Vendor'a ait parent ürünleri bul
        const parentProducts = await ParentProductModel.find({ vendor: vendorId }).exec();
        const parentProductIds = parentProducts.map(product => product._id);

        // Tüm satışları çek ve cart_item'ları ayır
        const allSales = await OrderModel.aggregate([
            {
                $unwind: "$cart_item"
            },
            {
                $addFields: {
                    "cart_item.order_payment_at": "$payment_at"
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$cart_item"
                }
            }
        ]);

        // Vendor'a ait satışları filtrele
        const vendorSales = allSales.filter(sale => {
            return parentProductIds.some(productId => productId.equals(sale.product));
        });

        // Ürünlerin toplam satışını hesapla
        const productSales = vendorSales.reduce((salesMap, sale) => {
            if (!salesMap[sale.product]) {
                salesMap[sale.product] = {
                    product: sale.product,
                    totalQuantity: 0,
                };
            }
            salesMap[sale.product].totalQuantity += sale.quantity;
            return salesMap;
        }, {});

        // Ürün adlarını al ve sonuçları oluştur
        const productIds = Object.keys(productSales);
        const productInfo = await ParentProductModel.find({ _id: { $in: productIds } }).exec();

        const result = productInfo.map(info => {
            const productSale = productSales[info._id.toString()];

            const productNameParts = info.name.split(" - ");
            return {
                productNumber: productNameParts[0],
                productName: productNameParts[1],
                productColor: productNameParts[2],
                totalSales: productSale.totalQuantity,
            };
        });

        res.status(200).json({"data" : result});
    } catch (error) {
        next(error);
    }
};

function calculateMonthlySales(sales: any[], year: string): number[] {
    const monthlySales: number[] = Array(12).fill(0);

    for (const sale of sales) {
        const orderDate = new Date(sale.order_payment_at);
        const saleYear = orderDate.getFullYear();

        if (saleYear.toString() === year) {
            const saleMonth = orderDate.getMonth();
            monthlySales[saleMonth] += sale.quantity;
        }
    }

    return monthlySales;
}








