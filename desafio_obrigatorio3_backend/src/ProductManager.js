const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        if (products.some(p => p.code === product.code)) {
            throw new Error("Já existe um produto com o mesmo código.");
        }

        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...product,
        };
        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch {
            throw new Error("Erro ao ler o arquivo de produtos.");
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id) || `Produto com ID ${id} não encontrado.`;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Produto com ID ${id} não encontrado.`);
        }
        products[index] = { ...products[index], ...updatedFields };
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        if (filteredProducts.length === products.length) {
            throw new Error(`Produto com ID ${id} não encontrado.`);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
        return `Produto com ID ${id} foi removido com sucesso.`;
    }
}

module.exports = ProductManager;
