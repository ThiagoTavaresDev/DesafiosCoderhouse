const express = require('express');
const handlebars = require('express-handlebars');
const socket = require('socket.io');
const connectDB = require('./config/db.config');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const MongoManager = require('./dao/db/mongo.manager');

const app = express();
const port = 8080;

// MongoDB connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars setup
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/chat', async (req, res) => {
    const messages = await MongoManager.getMessages();
    res.render('chat', { messages });
});

// Server setup with Socket.IO
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const io = socket(server);

io.on('connection', (socket) => {
    socket.on('chat message', async (msg) => {
        await MongoManager.saveMessage(msg);
        io.emit('chat message', msg);
    });
});