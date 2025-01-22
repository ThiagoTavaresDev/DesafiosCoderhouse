const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();
const productsFilePath = path.join(__dirname, '../data/produtos.json');

// Helper: Leitura e escrita no arquivo JSON
async function readProducts() {
  const data = await fs.readJson(productsFilePath, { throws: false });
  return data || [];
}

async function writeProducts(data) {
  await fs.writeJson(productsFilePath, data, { spaces: 2 });
}

// GET /api/products
router.get('/', async (req, res) => {
  const products = await readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  const products = await readProducts();
  const product = products.find(p => p.id === req.params.pid);
  if (!product) return res.status(404).send('Product not found');
  res.json(product);
});

// POST /api/products
router.post('/', async (req, res) => {
  const newProduct = req.body;
  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
    return res.status(400).send('All fields are required');
  }

  const products = await readProducts();
  newProduct.id = Date.now().toString();  // Generate unique ID
  products.push(newProduct);
  await writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  const products = await readProducts();
  const productIndex = products.findIndex(p => p.id === req.params.pid);
  if (productIndex === -1) return res.status(404).send('Product not found');

  const updatedProduct = req.body;
  const product = products[productIndex];
  products[productIndex] = { ...product, ...updatedProduct };
  await writeProducts(products);
  res.json(products[productIndex]);
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  const products = await readProducts();
  const productIndex = products.findIndex(p => p.id === req.params.pid);
  if (productIndex === -1) return res.status(404).send('Product not found');

  products.splice(productIndex, 1);
  await writeProducts(products);
  res.status(204).send();
});

module.exports = router;
