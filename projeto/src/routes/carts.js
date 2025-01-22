const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();
const cartsFilePath = path.join(__dirname, '../data/carrinho.json');

// Helper: Leitura e escrita no arquivo JSON
async function readCarts() {
  const data = await fs.readJson(cartsFilePath, { throws: false });
  return data || [];
}

async function writeCarts(data) {
  await fs.writeJson(cartsFilePath, data, { spaces: 2 });
}

// POST /api/carts
router.post('/', async (req, res) => {
  const newCart = { id: Date.now().toString(), products: [] };
  const carts = await readCarts();
  carts.push(newCart);
  await writeCarts(carts);
  res.status(201).json(newCart);
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  const carts = await readCarts();
  const cart = carts.find(c => c.id === req.params.cid);
  if (!cart) return res.status(404).send('Cart not found');
  res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const carts = await readCarts();
  const cart = carts.find(c => c.id === req.params.cid);
  if (!cart) return res.status(404).send('Cart not found');

  const productId = req.params.pid;
  const quantity = req.body.quantity;

  if (!quantity) return res.status(400).send('Quantity is required');

  const productIndex = cart.products.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    cart.products.push({ id: productId, quantity });
  } else {
    cart.products[productIndex].quantity += quantity;
  }

  await writeCarts(carts);
  res.status(201).json(cart.products);
});

module.exports = router;
