const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getProducts,
  createProducts,
  getProductById,
  deleteProductById,
  updateProductById
} = require('../controller/products');

module.exports = (app, nextMain) => {

  app.get('/products', requireAuth, getProducts);

  app.get('/products/:productId', requireAuth, getProductById);

  app.post('/products', requireAdmin, createProducts);

  app.patch('/products/:productId', requireAdmin, updateProductById);

  app.delete('/products/:productId', requireAdmin, deleteProductById);

  nextMain();
};
