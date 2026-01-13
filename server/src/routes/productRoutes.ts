import express, { Request, Response } from 'express';
import Product from '../models/Product';

const router = express.Router();

// GET /api/products - Get all products (with optional filtering)
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category, search, sale } = req.query;
        let query: any = {};

        if (category) {
            query.$or = [
                { category: category },
                { subCategory: category }
            ];
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (sale === 'flash') {
            query.discountPercentage = { $gte: 30 };
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

export const productRouter = router;
