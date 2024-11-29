const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        // Inicializa o arquivo se ele não existir
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        
        // Verifica se o código identificador já existe
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
        } catch (error) {
            throw new Error("Erro ao ler o arquivo de produtos.");
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        return product || `Produto com ID ${id} não encontrado.`;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error(`Produto com ID ${id} não encontrado.`);
        }

        // Atualiza o produto, preservando o ID
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

// Exemplo de uso
(async () => {
    const manager = new ProductManager('products.json');

    // Adiciona produtos
    await manager.addProduct({
        title: "Produto 1",
        description: "Descrição do Produto 1",
        price: 10.99,
        thumbnail: "img1.png",
        code: "p1",
        stock: 100,
    });

    await manager.addProduct({
        title: "Produto 2",
        description: "Descrição do Produto 2",
        price: 20.99,
        thumbnail: "img2.png",
        code: "p2",
        stock: 50,
    });

    // Obtém todos os produtos
    console.log(await manager.getProducts());

    // Obtém produto por ID
    console.log(await manager.getProductById(1));
    console.log(await manager.getProductById(99)); // Produto não encontrado

    // Atualiza produto
    console.log(await manager.updateProduct(1, { price: 15.99, stock: 90 }));

    // Exclui produto
    console.log(await manager.deleteProduct(2));
})();
