import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const formatPrice = (p) => `₹${p?.toLocaleString('en-IN')}`;

  const totalMonthlyRent = items.reduce((sum, item) => sum + (item.product?.monthlyRent || 0) * item.quantity, 0);
  const totalDeposit = items.reduce((sum, item) => sum + (item.product?.securityDeposit || 0) * item.quantity, 0);
  const totalPayable = totalMonthlyRent + totalDeposit;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Browse our products and start adding items to rent</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-img">
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/120x90?text=Item'}
                    alt={item.product?.name}
                  />
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-brand">{item.product?.brand}</p>
                  <h3 className="cart-item-name">{item.product?.name}</h3>
                  <div className="cart-item-tenure">
                    <span>📅 {item.tenure?.label} tenure</span>
                  </div>
                  <div className="cart-item-pricing">
                    <div>
                      <span className="ci-price">{formatPrice(item.product?.monthlyRent)}</span>
                      <span className="ci-label">/month</span>
                    </div>
                    <div className="ci-deposit">
                      + {formatPrice(item.product?.securityDeposit)} deposit
                    </div>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="item-total">
                    <p className="it-label">Pay now</p>
                    <p className="it-amount">{formatPrice((item.product?.monthlyRent + item.product?.securityDeposit) * item.quantity)}</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                    title="Remove item"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-rows">
              <div className="summary-row">
                <span>Monthly Rent Total</span>
                <span>{formatPrice(totalMonthlyRent)}</span>
              </div>
              <div className="summary-row">
                <span>Security Deposit</span>
                <span>{formatPrice(totalDeposit)}</span>
              </div>
              <div className="summary-row deposit-note">
                <span>↳ 100% refundable on return</span>
              </div>
              <div className="summary-row delivery">
                <span>Delivery</span>
                <span className="free-delivery">FREE</span>
              </div>
            </div>

            <div className="summary-total">
              <span>Total Payable Now</span>
              <span>{formatPrice(totalPayable)}</span>
            </div>

            <div className="summary-note">
              <span>💡</span>
              <p>You pay 1st month rent + deposit today. Subsequent months are billed on the same date.</p>
            </div>

            <button
              className="btn btn-primary checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
