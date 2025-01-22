const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Message = require('../models/message.model');

class MongoManager {
  async getProducts(limit) {
    const query = Product.find();
    if (limit) query.limit(limit);
    return await query.exec();
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async updateProduct(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async createCart() {
    const cart = new Cart({ products: [] });
    return await cart.save();
  }

  async getCart(id) {
    return await Cart.findById(id).populate('products.productId');
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
    if (productIndex === -1) {
      cart.products.push({ productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    return await cart.save();
  }

  async saveMessage(messageData) {
    const message = new Message(messageData);
    return await message.save();
  }

  async getMessages() {
    return await Message.find().sort({ timestamp: -1 });
  }
}

module.exports = new MongoManager();