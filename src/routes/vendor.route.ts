import express from 'express';
import {verifyVendor} from '../controllers/vendor.controller'

const router = express.Router();

router.get('/verify/:vendorId', verifyVendor)

export default router;