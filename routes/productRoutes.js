const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware } = require('../utils/jwtHelper');

// Add Product (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json({
            success: true,
            data: savedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            minPrice, 
            maxPrice, 
            search,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        const query = {};
        
        // Category filter
        if (category) {
            query.category = category;
        }

        // Price filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sortQuery = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortQuery[field] = order === 'desc' ? -1 : 1;
        } else {
            sortQuery = { createdAt: -1 }; // Default sort by newest
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        
        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(Number(limit)),
            Product.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update product (Protected Route)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete product (Protected Route)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add review to product
router.post('/:id/reviews', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const review = {
            user: req.userId,
            rating: req.body.rating,
            comment: req.body.comment
        };

        product.reviews.push(review);

        // Update average rating
        const avg = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        product.rating = Math.round(avg * 10) / 10;

        await product.save();

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 