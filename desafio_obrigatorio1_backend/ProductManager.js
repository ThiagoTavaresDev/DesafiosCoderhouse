class ProductManager {
    constructor() {
        this.products = [];
        this.incrementor = 1;
    }


    addProduct(title, description, price, thumbnail, stock) {
        const newProduct = {
            code: this.incrementor++,
            title,
            description,
            price,
            thumbnail,
            stock
        };
        this.products.push(newProduct);
    }


    getProductById(id) {
        const product = this.products.find(product => product.code === id);
        return product ? product : `Não encontrado`;
    }
}




const manager = new ProductManager();
manager.addProduct("Produto 1", "Descrição do Produto 1", 10.99, "img1.png", 100);
manager.addProduct("Produto 2", "Descrição do Produto 2", 20.99, "img2.png", 50);


console.log(manager.getProductById(1)); 
console.log(manager.getProductById(2)); 
console.log(manager.getProductById(3)); 
