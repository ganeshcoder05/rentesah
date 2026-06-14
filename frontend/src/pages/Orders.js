import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import './Orders.css';

const statusColors = {
  Pending: 'badge-yellow',
  Confirmed: 'badge-purple',
  Delivered: 'badge-green',
  Active: 'badge-green',
  'Return Requested': 'badge-yellow',
  Returned: 'badge-purple',
  Cancelled: 'badge-red'
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = p => `₹${p?.toLocaleString('en-IN')}`;
  const formatDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Rentals</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No rentals yet</h3>
            <p>You haven't placed any rental orders yet</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-meta">
                    <span className="order-num">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">Placed {formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`badge ${statusColors[order.status] || 'badge-purple'}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items-list">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-row">
                      <div className="oi-img">
                        <img
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/60?text=Item'}
                          alt={item.productName}
                        />
                      </div>
                      <div className="oi-info">
                        <p className="oi-name">{item.productName}</p>
                        <p className="oi-tenure">{item.tenure?.label} rental</p>
                      </div>
                      <div className="oi-price">
                        <p>{formatPrice(item.monthlyRent)}/mo</p>
                        <p className="oi-deposit">+{formatPrice(item.securityDeposit)} dep.</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-delivery">
                    <span>📅 Delivery: {formatDate(order.deliveryDate)}</span>
                    <span>📍 {order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}</span>
                  </div>
                  <div className="order-total-row">
                    <span>Total Paid</span>
                    <span className="order-total-amount">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
