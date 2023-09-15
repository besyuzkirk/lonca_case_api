import express from 'express';
import {calculateMonthlyRevenuesByVendor, calculateSalesByVendor} from '../controllers/order.controller'

const router = express.Router();

router.get('/monthlyRevenues', calculateMonthlyRevenuesByVendor)
router.get('/salesByVendor/:vendorId', calculateSalesByVendor)

export default router;