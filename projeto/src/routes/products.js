const express = require('express');
const Product = require('../dao/models/product.model');
const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : undefined
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
    
    // Build response object
    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', payload: deletedProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

module.exports = router;
