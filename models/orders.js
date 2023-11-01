const mongoose =  require('mongoose');

const ProductOrderSchema = new mongoose.Schema({
    qty: { type: Number, required: true },
    product: {
        name: { type: String },
        price: { type: Number },
        image: { type: String },
        type: { type: String },
    }
});

const OrderSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: String, required: true },
    products: { type: [ProductOrderSchema], required: true },
    status: { type: String, enum: ['pending', 'in progress', 'ready', 'delivered']},
    dateEntry: { type: Date, default: Date.now },
    dateProcessed: { type: Date }
});

const Order = mongoose.model('Order', OrderSchema);

async function findOrders() {
    return await Order.find({});
};

async function findById(id) {
    return await Order.findById(id);
};

async function create(order) {
    return await Order.create(order);
};

async function deleteById(id) {
    return await Order.findOneAndDelete({ _id: id });
};

async function updateById(id, values) {
    return await Order.findByIdAndUpdate(id, values, { new: true });
};

module.exports = {
    Order,
    findOrders,
    findById,
    create,
    deleteById,
    updateById
};