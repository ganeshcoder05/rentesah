const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// POST /api/orders - Place order from cart
router.post('/', protect, async (req, res) => {
  try {
    const { deliveryAddress, deliveryDate, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalMonthlyRent = 0;
    let totalSecurityDeposit = 0;

    const orderItems = cart.items.map(item => {
      totalMonthlyRent += item.product.monthlyRent * item.quantity;
      totalSecurityDeposit += item.product.securityDeposit * item.quantity;
      return {
        product: item.product._id,
        productName: item.product.name,
        monthlyRent: item.product.monthlyRent,
        securityDeposit: item.product.securityDeposit,
        tenure: item.tenure,
        quantity: item.quantity
      };
    });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      deliveryDate: new Date(deliveryDate),
      totalMonthlyRent,
      totalSecurityDeposit,
      totalAmount: totalMonthlyRent + totalSecurityDeposit,
      notes
    });

    // Clear cart after order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders - Get user's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
