import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { productRouter } from './routes/productRoutes';
import { authRouter } from './routes/authRoutes';
import { cartRouter } from './routes/cartRoutes';
import { orderRouter } from './routes/orderRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flipkart_clone';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Middleware
const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Check if origin is allowed
        if (allowedOrigins.includes(origin) || process.env.FRONTEND_URL === '*') {
            return callback(null, true);
        }

        // Also allow any vercel.app domain
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Flipkart Clone API is running');
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });
