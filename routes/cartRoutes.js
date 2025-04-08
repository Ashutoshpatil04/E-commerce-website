const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../utils/jwtHelper');

// Get user's cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.userId })
            .populate('items.product');

        if (!cart) {
            cart = await Cart.create({
                user: req.userId,
                items: [],
                totalAmount: 0
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add item to cart
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        // Validate product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: req.userId });
        if (!cart) {
            cart = await Cart.create({
                user: req.userId,
                items: [],
                totalAmount: 0
            });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        // Calculate total amount
        cart.totalAmount = await calculateTotal(cart.items);
        await cart.save();

        // Populate product details
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update cart item quantity
router.put('/update/:productId', authMiddleware, async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        let cart = await Cart.findOne({ user: req.userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        cart.totalAmount = await calculateTotal(cart.items);
        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Remove item from cart
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: req.userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(item => 
            item.product.toString() !== productId
        );

        cart.totalAmount = await calculateTotal(cart.items);
        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Helper function to calculate total amount
async function calculateTotal(items) {
    let total = 0;
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (product) {
            const price = product.offerPrice || product.price;
            total += price * item.quantity;
        }
    }
    return Math.round(total * 100) / 100; // Round to 2 decimal places
}

module.exports = router; 