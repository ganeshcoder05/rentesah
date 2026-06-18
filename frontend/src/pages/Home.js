import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API from '../api';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products?limit=6');
        setFeaturedProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Beds', icon: '🛏️', subcategory: 'Bed', count: 'Comfortable sleep' },
    { name: 'Sofas', icon: '🛋️', subcategory: 'Sofa', count: 'Living room ready' },
    { name: 'Tables', icon: '🪑', subcategory: 'Table', count: 'Work from home' },
    { name: 'Refrigerators', icon: '🧊', subcategory: 'Fridge', count: 'Fresh food storage' },
    { name: 'Washing Machines', icon: '🌀', subcategory: 'Washing Machine', count: 'Laundry sorted' },
    { name: 'TVs', icon: '📺', subcategory: 'TV', count: 'Entertainment' },
  ];

  const whyUs = [
    { icon: '💰', title: 'Save Upfront Cost', desc: 'Pay only monthly rent + refundable deposit. No big one-time investment.' },
    { icon: '🚚', title: 'Free Delivery', desc: 'We deliver and set up everything at your doorstep, on your schedule.' },
    { icon: '🔧', title: 'Maintenance Included', desc: 'Any issues? We fix it. Maintenance support throughout your rental tenure.' },
    { icon: '🔄', title: 'Easy Returns', desc: 'Moving out? We pick it up. No hassle, no questions asked.' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">🏙️ Serving Kolkata ,Bangalore, Mumbai & Delhi</div>
            <h1 className="hero-title">
              Rent Furniture &<br />Appliances<br />
              <span>Monthly.</span>
            </h1>
            <p className="hero-desc">
              No big upfront costs. No ownership stress. Just pay monthly and live comfortably — perfect for students and working professionals who move often.
            </p>
            <form className="hero-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search beds, sofa, fridge, TV..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
            <div className="hero-stats">
              <div className="stat"><span>500+</span><p>Products</p></div>
              <div className="stat"><span>10,000+</span><p>Happy Renters</p></div>
              <div className="stat"><span>4 Cities</span><p>& Growing</p></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card floating">
              <div className="hero-card-icon">🛏️</div>
              <div>
                <p className="hero-card-label">King Size Bed</p>
                <p className="hero-card-price">₹1,200/mo</p>
              </div>
            </div>
            <div className="hero-card floating-2">
              <div className="hero-card-icon">📺</div>
              <div>
                <p className="hero-card-label">43" Smart TV</p>
                <p className="hero-card-price">₹950/mo</p>
              </div>
            </div>
            <div className="hero-card floating-3">
              <div className="hero-card-icon">🧊</div>
              <div>
                <p className="hero-card-label">350L Fridge</p>
                <p className="hero-card-price">₹1,500/mo</p>
              </div>
            </div>
            <div className="hero-bg-circle"></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <Link to="/products" className="see-all">See all →</Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.subcategory}
                to={`/products?subcategory=${cat.subcategory}`}
                className="category-card"
              >
                <span className="category-icon">{cat.icon}</span>
                <h4>{cat.name}</h4>
                <p>{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="see-all">View all →</Link>
          </div>
          {loading ? (
            <div className="loading-screen"><div className="spinner"></div></div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why RentEase */}
      <section className="section">
        <div className="container">
          <div className="section-header centered">
            <h2>Why RentEase?</h2>
            <p>Built for people who value flexibility and smart living</p>
          </div>
          <div className="why-grid">
            {whyUs.map((item, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <h2>Ready to move in?</h2>
            <p>Browse our catalog and get furniture delivered in 48 hours</p>
            <Link to="/products" className="btn btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              Start Browsing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
