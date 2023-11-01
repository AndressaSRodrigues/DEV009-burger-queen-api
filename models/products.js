const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true, enum: ['breakfast', 'lunch/dinner', 'drinks'] },
});

const Product = mongoose.model('Product', ProductSchema);

async function findProducts() {
    return await Product.find({});
};

async function findById(id) {
    return await Product.findById(id);
};

async function create(product) {
    return await Product.create(product);
};

async function deleteById(id) {
    return await Product.findOneAndDelete({ _id: id });
};

async function updateById(id, values) {
    return await Product.findByIdAndUpdate(id, values, { new: true });
};

module.exports = {
    Product,
    findProducts,
    findById,
    create,
    deleteById,
    updateById
};