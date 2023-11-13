const mongoose = require('mongoose');

const ProductOrderSchema = new mongoose.Schema({
  qty: { type: Number, required: true },
  product: {
    name: { type: String },
    price: { type: Number },
    image: { type: String },
    type: { type: String },
  },
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
  client: { type: String, required: true },
  products: { type: [ProductOrderSchema], required: true },
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'delivered'], default: 'pending' },
  dateEntry: { type: Date, default: Date.now },
  dateProcessed: { type: Date },
});

const Order = mongoose.model('Order', OrderSchema);

async function findOrders() {
  return Order.find({});
}

async function findById(id) {
  return Order.findById(id);
}

async function create(order) {
  return Order.create(order);
}

async function deleteById(id) {
  return Order.findOneAndDelete({ _id: id });
}

async function updateById(id, values) {
  return Order.findByIdAndUpdate(id, values, { new: true });
}

module.exports = {
  Order,
  findOrders,
  findById,
  create,
  deleteById,
  updateById,
};
