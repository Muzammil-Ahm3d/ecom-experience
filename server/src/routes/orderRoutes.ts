import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
} from '../controllers/orderController';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export const orderRouter = router;
