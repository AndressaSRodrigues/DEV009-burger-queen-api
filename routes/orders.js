const { 
  getOrders,
  getOrderById, 
  createOrder,
  updateOrderById,
  deleteOrderById
} = require('../controller/orders');

const {
  requireAuth,
} = require('../middleware/auth');

module.exports = (app, nextMain) => {

  app.get('/orders', requireAuth, getOrders);

  app.get('/orders/:orderId', requireAuth, getOrderById);

  app.post('/orders', requireAuth, createOrder);

  app.patch('/orders/:orderId', requireAuth, updateOrderById);

  app.delete('/orders/:orderId', requireAuth, deleteOrderById);

  nextMain();
};
