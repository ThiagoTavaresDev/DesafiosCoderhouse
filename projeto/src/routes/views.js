const express = require('express');
const Product = require('../dao/models/product.model');
const Cart = require('../dao/models/cart.model');
const router = express.Router();

// GET /products
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : undefined,
            lean: true // This is important for handlebars to work with mongoose documents
        };

        // Build query filter
        const filter = {};
        if (query) {
            if (query.includes('category:')) {
                filter.category = query.split(':')[1];
            } else if (query.includes('available:')) {
                filter.stock = query.split(':')[1] === 'true' ? { $gt: 0 } : { $eq: 0 };
            }
        }

        const result = await Product.paginate(filter, options);
        
        // Get unique categories for filter dropdown
        const categories = await Product.distinct('category');

        // Prepare data for view
        const viewData = {
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
            categories
        };

        res.render('products', viewData);
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

// GET /carts/:cid
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
            .populate('products.productId')
            .lean();

        if (!cart) {
            return res.status(404).render('error', { error: 'Cart not found' });
        }

        // Calculate cart total
        const cartTotal = cart.products.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);

        res.render('cart', { cart, cartTotal });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

module.exports = router;
