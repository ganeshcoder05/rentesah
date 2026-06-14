import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../api';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTenure, setSelectedTenure] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        if (data.tenureOptions?.length > 0) {
          setSelectedTenure(data.tenureOptions[1] || data.tenureOptions[0]);
        }
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (!selectedTenure) {
      toast.error('Please select a rental tenure');
      return;
    }
    setAddingToCart(true);
    const result = await addToCart(product._id, selectedTenure);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.message);
    }
    setAddingToCart(false);
  };

  const formatPrice = (p) => `₹${p?.toLocaleString('en-IN')}`;

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!product) return null;

  const totalFirstMonth = product.monthlyRent + product.securityDeposit;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <span onClick={() => navigate('/products')} className="bc-link">Products</span>
          <span>›</span>
          <span onClick={() => navigate(`/products?category=${product.category}`)} className="bc-link">{product.category}</span>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          <div className="product-image-section">
            <div className="product-main-image">
              <img
                src={product.images?.[0] || '/images/bed1.jpg'}
                alt={product.name}
                onError={e => { e.target.src = '/images/bed1.jpg'; }}
              />
              {product.availableQuantity === 0 && (
                <div className="out-of-stock-overlay">Out of Stock</div>
              )}
            </div>
            <div className="product-tags">
              <span className="badge badge-purple">{product.subcategory}</span>
              <span className={`badge ${product.condition === 'New' ? 'badge-green' : 'badge-yellow'}`}>
                {product.condition}
              </span>
              <span className="badge badge-purple">{product.city}</span>
            </div>
          </div>

          <div className="product-info-section">
            <p className="product-brand-tag">{product.brand}</p>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-desc">{product.description}</p>

            <div className="pricing-card">
              <div className="pricing-row">
                <div>
                  <p className="pricing-label">Monthly Rent</p>
                  <p className="pricing-value">{formatPrice(product.monthlyRent)}<span>/mo</span></p>
                </div>
                <div>
                  <p className="pricing-label">Security Deposit</p>
                  <p className="pricing-value refund">{formatPrice(product.securityDeposit)}</p>
                  <p className="pricing-note">100% refundable</p>
                </div>
              </div>
              <div className="pricing-total">
                <span>Pay at checkout</span>
                <span className="total-amount">{formatPrice(totalFirstMonth)}</span>
              </div>
            </div>

            <div className="tenure-section">
              <h3>Select Rental Tenure</h3>
              <div className="tenure-options">
                {product.tenureOptions?.map((tenure, i) => (
                  <button
                    key={i}
                    className={`tenure-option ${selectedTenure?.months === tenure.months ? 'selected' : ''}`}
                    onClick={() => setSelectedTenure(tenure)}
                  >
                    <span className="tenure-months">{tenure.months}</span>
                    <span className="tenure-unit">months</span>
                    {selectedTenure?.months === tenure.months && <span className="tenure-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {selectedTenure && (
              <div className="tenure-summary">
                <div className="ts-row">
                  <span>Monthly Rent × {selectedTenure.months} months</span>
                  <span>{formatPrice(product.monthlyRent * selectedTenure.months)}</span>
                </div>
                <div className="ts-row">
                  <span>Security Deposit (refundable)</span>
                  <span>{formatPrice(product.securityDeposit)}</span>
                </div>
                <div className="ts-row total">
                  <span>Total Rental Value</span>
                  <span>{formatPrice(product.monthlyRent * selectedTenure.months + product.securityDeposit)}</span>
                </div>
              </div>
            )}

            <div className="product-cta">
              <button
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={addingToCart || product.availableQuantity === 0}
              >
                {addingToCart ? 'Adding...' : product.availableQuantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/cart')}>
                View Cart
              </button>
            </div>

            <p className="availability">
              {product.availableQuantity > 0
                ? `✅ ${product.availableQuantity} units available`
                : '❌ Currently out of stock'}
            </p>
          </div>
        </div>

        {product.features?.length > 0 && (
          <div className="product-features-section">
            <h2>Key Features</h2>
            <div className="features-grid">
              {product.features.map((feat, i) => (
                <div key={i} className="feature-item">
                  <span className="feat-check">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;