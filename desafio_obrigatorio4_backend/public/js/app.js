const socket = io();

// Atualiza a lista de produtos
socket.on('updateProducts', (products) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpa a lista

    products.forEach(product => {
        const li = document.createElement('li');
        li.id = `product-${product.id}`;
        li.textContent = `${product.name} - ${product.price}`;
        productList.appendChild(li);
    });
});

// Adicionar produto
document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;

    if (name && price) {
        socket.emit('addProduct', { id: Date.now().toString(), name, price });
        e.target.reset();
    }
});

// Remover produto
document.getElementById('delete-product-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const productId = document.getElementById('delete-id').value;
    if (productId) {
        socket.emit('deleteProduct', productId);
        e.target.reset();
    }
});
