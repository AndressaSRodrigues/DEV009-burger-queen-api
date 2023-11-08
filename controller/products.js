const {
  Product,
  findProducts,
  findById,
  create,
  deleteById,
  updateById,
} = require('../models/products');

const getProducts = async (req, res) => {
  try {
    const products = await findProducts();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Products not found' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await findById(productId);
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Could not find product.' });
  }
};

const createProducts = async (req, res) => {
  const {
    name, price, image, type,
  } = req.body;

  if (!name || !price || !type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const product = new Product({
    name,
    price,
    image,
    type,
  });

  try {
    const newProduct = await create(product);
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Product creation failed' });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const values = req.body;

    const updatedProduct = await updateById(productId, values);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Product update failed.' });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    await deleteById(productId);
    return res.status(200).json({ message: 'Product deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Product delete failed.' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProducts,
  updateProductById,
  deleteProductById,
};
