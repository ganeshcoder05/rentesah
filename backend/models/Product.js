const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Furniture', 'Appliances'],
  },
  subcategory: {
    type: String,
    required: true
    // e.g. Bed, Sofa, Table, Fridge, Washing Machine, TV
  },
  description: {
    type: String,
    required: true
  },
  images: [String],
  monthlyRent: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  tenureOptions: [{
    months: Number,
    label: String // e.g. "3 Months", "6 Months", "12 Months"
  }],
  brand: String,
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good'],
    default: 'Good'
  },
  availableQuantity: {
    type: Number,
    default: 1,
    min: 0
  },
  city: {
    type: String,
    default: 'Bangalore'
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
