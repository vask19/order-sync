const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderID: { type: String, required: true },
    products: [{
        productID: { type: String, required: true },
        quantity: { type: Number, required: true }
    }],
    orderWorth: { type: Number, required: true },
    orderAddDate: { type: Date}
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
