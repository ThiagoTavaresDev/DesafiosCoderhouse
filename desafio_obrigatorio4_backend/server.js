const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuração do Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Lista de produtos (mock)
let products = [];

// Roteador de views
app.get('/', (req, res) => {
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

// WebSocket
io.on('connection', (socket) => {
    console.log('Novo cliente conectado.');

    socket.emit('updateProducts', products);

    socket.on('addProduct', (product) => {
        products.push(product);
        io.emit('updateProducts', products); // Atualiza todos os clientes
    });

    socket.on('deleteProduct', (productId) => {
        products = products.filter(p => p.id !== productId);
        io.emit('updateProducts', products); // Atualiza todos os clientes
    });
});

// Iniciar servidor
const PORT = 3000;
httpServer.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
