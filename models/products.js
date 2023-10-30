const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true, enum: ['breakfast', 'lunch/dinner'] },
    dateEntry: { type: String, required: true }
});

module.exports = { ProductSchema };
