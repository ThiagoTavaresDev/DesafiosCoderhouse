const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 3000;
const productManager = new ProductManager('./products.json');

// Rota para listar todos os produtos com suporte a ?limit
app.get('/products', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts();
        if (limit) {
            return res.json({ products: products.slice(0, parseInt(limit, 10)) });
        }
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para obter um produto pelo ID
app.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(parseInt(pid, 10));
        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
