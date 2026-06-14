import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏠</span>
          <span className="logo-text">Rent<span>Ease</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            Browse
          </Link>
          <Link to="/products?category=Furniture" className="nav-link" onClick={() => setMenuOpen(false)}>
            Furniture
          </Link>
          <Link to="/products?category=Appliances" className="nav-link" onClick={() => setMenuOpen(false)}>
            Appliances
          </Link>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn" title="Cart">
                🛒
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="user-menu">
                <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                  <span className="user-name">{user.name?.split(' ')[0]}</span>
                  <span>▾</span>
                </button>
                {dropdownOpen && (
                  <>
                    <div className="dropdown-overlay" onClick={() => setDropdownOpen(false)} />
                    <div className="dropdown">
                      <Link to="/orders" onClick={() => setDropdownOpen(false)}>My Rentals</Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}>Admin Panel</Link>
                      )}
                      <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '13px' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>Sign Up</Link>
            </>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;