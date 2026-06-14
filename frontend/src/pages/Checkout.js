import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    deliveryDate: '',
    notes: ''
  });

  const items = cart?.items || [];
  const formatPrice = (p) => `₹${p?.toLocaleString('en-IN')}`;

  const totalMonthlyRent = items.reduce((sum, item) => sum + (item.product?.monthlyRent || 0) * item.quantity, 0);
  const totalDeposit = items.reduce((sum, item) => sum + (item.product?.securityDeposit || 0) * item.quantity, 0);
  const totalPayable = totalMonthlyRent + totalDeposit;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Min delivery date = 2 days from now
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.street || !form.city || !form.pincode || !form.deliveryDate) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/orders', {
        deliveryAddress: {
          name: form.name,
          phone: form.phone,
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode
        },
        deliveryDate: form.deliveryDate,
        notes: form.notes
      });

      toast.success('Order placed successfully!');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Complete your rental order</p>
        </div>

        <div className="checkout-layout">
          {/* Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit}>
              {/* Delivery Address */}
              <div className="form-card">
                <h2>📍 Delivery Address</h2>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input name="street" value={form.street} onChange={handleChange} placeholder="House/Flat no., Street, Area" required />
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label>City *</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input name="state" value={form.state} onChange={handleChange} placeholder="State" />
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" required />
                  </div>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="form-card">
                <h2>📅 Preferred Delivery Date</h2>
                <p className="form-hint">Minimum 2 days from today. Our team will confirm the exact time slot.</p>
                <div className="form-group">
                  <label>Select Date *</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={form.deliveryDate}
                    min={minDateStr}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="form-card">
                <h2>📝 Special Instructions (Optional)</h2>
                <div className="form-group">
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Floor number, landmark, specific time preference..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary place-order-btn"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order — ${formatPrice(totalPayable)}`}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="checkout-items">
              {items.map(item => (
                <div key={item._id} className="checkout-item">
                  <div className="ci-thumb">
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/60x60?text=Item'}
                      alt={item.product?.name}
                    />
                  </div>
                  <div className="ci-details">
                    <p className="ci-name">{item.product?.name}</p>
                    <p className="ci-tenure">{item.tenure?.label}</p>
                  </div>
                  <div className="ci-price-col">
                    <p>{formatPrice(item.product?.monthlyRent)}/mo</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="ct-row">
                <span>Monthly Rent</span>
                <span>{formatPrice(totalMonthlyRent)}</span>
              </div>
              <div className="ct-row">
                <span>Security Deposit</span>
                <span>{formatPrice(totalDeposit)}</span>
              </div>
              <div className="ct-row">
                <span>Delivery</span>
                <span className="free">Free</span>
              </div>
              <div className="ct-total">
                <span>Pay Now</span>
                <span>{formatPrice(totalPayable)}</span>
              </div>
            </div>

            <div className="payment-notice">
              <h4>💳 Payment</h4>
              <p>Our team will contact you to confirm the order and collect payment before delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
