const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: String,
  monthlyRent: Number,
  securityDeposit: Number,
  tenure: {
    months: Number,
    label: String
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  deliveryAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  totalMonthlyRent: Number,
  totalSecurityDeposit: Number,
  totalAmount: Number, // first month rent + security deposit
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivered', 'Active', 'Return Requested', 'Returned', 'Cancelled'],
    default: 'Pending'
  },
  rentalStartDate: Date,
  rentalEndDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
