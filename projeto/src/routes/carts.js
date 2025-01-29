const express = require('express');
const Cart = require('../dao/models/cart.model');
const router = express.Router();

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.productId');
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// POST /api/carts
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products },
      { new: true }
    ).populate('products.productId');
    
    if (!updatedCart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 0) {
      return res.status(400).json({ status: 'error', error: 'Invalid quantity' });
    }

    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

    const productIndex = cart.products.findIndex(p => p.productId.toString() === req.params.pid);
    
    if (productIndex === -1) {
      cart.products.push({ productId: req.params.pid, quantity });
    } else {
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();
    const updatedCart = await cart.populate('products.productId');
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

    cart.products = [];
    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

// DELETE /api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

    cart.products = cart.products.filter(p => p.productId.toString() !== req.params.pid);
    await cart.save();
    
    const updatedCart = await cart.populate('products.productId');
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

module.exports = router;
