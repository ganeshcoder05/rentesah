const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.find({ status: { $in: ['Active', 'Delivered'] } })
    ]);

    const monthlyRevenue = orders.reduce((sum, o) => sum + (o.totalMonthlyRent || 0), 0);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      monthlyRevenue,
      activeRentals: orders.filter(o => o.status === 'Active').length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed sample products
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    
    const sampleProducts = [
      {
        name: 'King Size Bed with Storage',
        category: 'Furniture',
        subcategory: 'Bed',
        description: 'Spacious king size bed with hydraulic storage. Perfect for studio apartments.',
        images: ['https://placehold.co/600x400/6C63FF/white?text=King+Size+Bed'],
        monthlyRent: 1200,
        securityDeposit: 3600,
        tenureOptions: [{ months: 3, label: '3 Months' }, { months: 6, label: '6 Months' }, { months: 12, label: '12 Months' }],
        brand: 'Nilkamal',
        condition: 'New',
        availableQuantity: 5,
        city: 'Bangalore',
        features: ['Hydraulic storage', 'Wooden frame', 'Easy assembly']
      },
      {
        name: '3-Seater Fabric Sofa',
        category: 'Furniture',
        subcategory: 'Sofa',
        description: 'Comfortable 3-seater sofa in premium fabric. Ideal for living rooms.',
        images: ['https://placehold.co/600x400/6C63FF/white?text=3+Seater+Sofa'],
        monthlyRent: 800,
        securityDeposit: 2400,
        tenureOptions: [{ months: 3, label: '3 Months' }, { months: 6, label: '6 Months' }, { months: 12, label: '12 Months' }],
        brand: 'Urban Ladder',
        condition: 'New',
        availableQuantity: 8,
        city: 'Bangalore',
        features: ['3-seater', 'Fabric upholstery', 'Solid wood legs']
      },
      {
        name: 'Study Table with Bookshelf',
        category: 'Furniture',
        subcategory: 'Table',
        description: 'Ergonomic study table with built-in bookshelf. Great for students and WFH professionals.',
        images: ['https://placehold.co/600x400/6C63FF/white?text=Study+Table'],
        monthlyRent: 450,
        securityDeposit: 1350,
        tenureOptions: [{ months: 3, label: '3 Months' }, { months: 6, label: '6 Months' }, { months: 12, label: '12 Months' }],
        brand: 'Durian',
        condition: 'Good',
        availableQuantity: 12,
        city: 'Bangalore',
        features: ['Built-in bookshelf', 'Cable management', 'Anti-scratch surface']
      },
      {
        name: 'Double Door Refrigerator 350L',
        category: 'Appliances',
        subcategory: 'Fridge',
        description: 'Energy-efficient 350L double door refrigerator. Frost-free technology.',
        images: ['https://placehold.co/600x400/22C55E/white?text=350L+Refrigerator'],
        monthlyRent: 1500,
        securityDeposit: 4500,
        tenureOptions: [{ months: 3, label: '3 Months' }, { months: 6, label: '6 Months' }, { months: 12, label: '12 Months' }],
        brand: 'LG',
        condition: 'Like New',
        availableQuantity: 4,
        city: 'Bangalore',
        features: ['350L capacity', 'Frost-free', '5-star energy rating', 'Inverter compressor']
      },
      {
        name: 'Front Load Washing Machine 7kg',
        category: 'Appliances',
        subcategory: 'Washing Machine',
        description: 'Fully automatic front load washing machine with 15 wash programs.',
        images: ['https://placehold.co/600x400/22C55E/white?text=Washing+Machine'],
        monthlyRent: 1100,
        securityDeposit: 3300,
        tenureOptions: [{ months: 3, label: '3 Months' }, { months: 6, label: '6 Months' }, { months: 12, label: '12 Months' }],
        brand: 'Samsung',
        condition: 'Like New',
        availableQuantity: 6,
        city: 'Bangalore',
        features: ['7kg capacity', '15 wash programs', 'Inverter motor', 'Quick wash 15 mins']
      },
      {
        name: '43-inch 4K Smart TV',
        category: 'Appliances',
        subcategory: 'TV',
        description: '43-inch 4K UHD Smart TV with built-in Android and voice control.',
        images: ['https://placehold.co/600x400/22C55E/white?text=43+inch+Smart+TV'],
        monthlyRent: 950,
        securityDeposit: 2850,
        tenureOptions: [{ months: 3, label: '3 Months' }, { months: 6, label: '6 Months' }, { months: 12, label: '12 Months' }],
        brand: 'Sony',
        condition: 'New',
        availableQuantity: 7,
        city: 'Bangalore',
        features: ['4K UHD', 'Android TV', 'Voice control', 'Dolby Audio', '2 HDMI ports']
      },
      {
        name: 'Single Bed with Mattress',
        category: 'Furniture',
        subcategory: 'Bed',
        description: 'Single bed with premium orthopedic mattress. Great for PG and hostels.',
        images: ['https://placehold.co/600x400/6C63FF/white?text=Single+Bed'],
        monthlyRent: 650,
        securityDeposit: 1950,
        tenureOptions: [{ months: 1, label: '1 Month' }, { months: 3, label: '3 Months' }, { months: 6, label: '6 Months' }],
        brand: 'Sleepwell',
        condition: 'New',
        availableQuantity: 10,
        city: 'Bangalore',
        features: ['Single size', 'Orthopedic mattress', 'Wooden frame']
      },
      {
        name: 'Microwave Oven 25L',
        category: 'Appliances',
        subcategory: 'Fridge',
        description: 'Convection microwave oven with 25L capacity. Multiple cooking modes.',
        images: ['https://placehold.co/600x400/22C55E/white?text=Microwave+Oven'],
        monthlyRent: 500,
        securityDeposit: 1500,
        tenureOptions: [{ months: 3, label: '3 Months' }, { months: 6, label: '6 Months' }, { months: 12, label: '12 Months' }],
        brand: 'IFB',
        condition: 'Good',
        availableQuantity: 9,
        city: 'Bangalore',
        features: ['25L capacity', 'Convection mode', 'Auto-cook menu', 'Child lock']
      }
    ];

    const products = await Product.insertMany(sampleProducts);
    res.json({ message: `${products.length} products seeded`, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;