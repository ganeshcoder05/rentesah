import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [id]);

  const formatPrice = (p) => `₹${p?.toLocaleString('en-IN')}`;
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h1>Order Placed!</h1>
          <p className="success-subtitle">Your rental order has been received. Our team will call you within 24 hours to confirm and collect payment.</p>

          {order && (
            <div className="order-details-box">
              <div className="order-id-row">
                <span>Order ID</span>
                <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="order-id-row">
                <span>Delivery By</span>
                <span>{formatDate(order.deliveryDate)}</span>
              </div>
              <div className="order-id-row">
                <span>Deliver To</span>
                <span>{order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}</span>
              </div>
              <div className="order-id-row">
                <span>Total Amount</span>
                <span className="order-total">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="order-id-row">
                <span>Status</span>
                <span className="badge badge-yellow">{order.status}</span>
              </div>
            </div>
          )}

          <div className="success-items">
            <h3>Items Ordered</h3>
            {order?.items?.map((item, i) => (
              <div key={i} className="si-row">
                <span>{item.productName}</span>
                <span className="badge badge-purple">{item.tenure?.label}</span>
                <span>{formatPrice(item.monthlyRent)}/mo</span>
              </div>
            ))}
          </div>

          <div className="success-actions">
            <Link to="/orders" className="btn btn-primary">View My Rentals</Link>
            <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
