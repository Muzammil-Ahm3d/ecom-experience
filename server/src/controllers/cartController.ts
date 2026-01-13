import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        let cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { productId, quantity = 1, variant } = req.body;

        console.log('Adding to cart:', { userId, productId, quantity });

        // Verify product exists
        const product = await Product.findById(productId);
        console.log('Product found:', product ? 'Yes' : 'No');
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ productId, quantity, variant });
        }

        await cart.save();

        // Return populated cart
        const populatedCart = await Cart.findById(cart._id).populate('items.productId');
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Update item quantity
// @route   PUT /api/cart/update/:productId
// @access  Private
export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            res.status(400).json({ message: 'Quantity must be at least 1' });
            return;
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            res.status(404).json({ message: 'Item not in cart' });
            return;
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.productId');
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.productId');
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({ message: 'Cart cleared', items: [] });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
