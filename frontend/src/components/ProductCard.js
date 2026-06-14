import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;
  const categoryColor = product.category === 'Furniture' ? 'badge-purple' : 'badge-green';

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-img">
        <img
          src={product.images?.[0] || '/images/bed1.jpg'}
          alt={product.name}
          loading="lazy"
          onError={e => { e.target.src = '/images/bed1.jpg'; }}
        />
        <span className={`badge ${categoryColor} product-category-badge`}>
          {product.subcategory}
        </span>
        {product.availableQuantity === 0 && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
      </div>
      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-pricing">
          <div className="rent-price">
            <span className="price-amount">{formatPrice(product.monthlyRent)}</span>
            <span className="price-label">/month</span>
          </div>
          <div className="deposit-info">Deposit: {formatPrice(product.securityDeposit)}</div>
        </div>
        <div className="product-tenure-tags">
          {product.tenureOptions?.slice(0, 3).map((t, i) => (
            <span key={i} className="tenure-tag">{t.label}</span>
          ))}
        </div>
        <div className="product-card-footer">
          <span className={`condition-dot ${product.condition === 'New' ? 'new' : product.condition === 'Like New' ? 'like-new' : 'good'}`}>
            ● {product.condition}
          </span>
          <span className="view-details">View Details →</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;