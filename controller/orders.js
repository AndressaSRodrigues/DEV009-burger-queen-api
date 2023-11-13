const {
  Order,
  findOrders,
  findById,
  create,
  deleteById,
  updateById,
} = require('../models/orders');

const getOrders = async (req, res) => {
  try {
    const orders = await findOrders();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Orders not found' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await findById(orderId);
    if(!order){
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch order.' });
  }
};

const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { client, products } = req.body;

  if (!client || !products) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const order = new Order({
    userId,
    client,
    products,
  });

  try {
    const newOrder = await create(order);
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Order creation failed' });
  }
};

const updateOrderById = async (req, res) => {
  const { orderId } = req.params;
  const values = req.body;

  const order = await findById(orderId);

  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  if (!values.status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  if (values.status === 'ready') {
    values.dateProcessed = new Date();
  }

  try {
    const updatedOrder = await updateById(orderId, values);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update.' });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await deleteById(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.status(200).json({ message: 'Order deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Order delete failed.' });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
};
