const express = require('express');
const fs = require('fs-extra');
const productsRouter = require('./api/products');
const cartsRouter = require('./api/carts');

const app = express();
const port = 8080;

app.use(express.json());

// Roteadores
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
