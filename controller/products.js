const mongoose = require('mongoose');
const { ProductSchema } = require('../models/products');

const Product = mongoose.model('Product', ProductSchema);

async function getProducts() {
    return await Product.find({});
}

async function getProductById(id) {
    return await Product.findById(id);
}

async function createProduct(product) {
    return await Product.create(product);
}

async function deleteProductById(id) {
    return await Product.findOneAndDelete({ _id: id });
}

async function updateProductById(id, values) {
    return await Product.findByIdAndUpdate(id, values);
}

module.exports = {
    Product,
    getProducts,
    getProductById,
    createProduct,
    deleteProductById,
    updateProductById
};