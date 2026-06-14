import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">🏠 <span>Rent<em>Ease</em></span></div>
          <p>Affordable monthly rental of furniture & appliances for students and working professionals.</p>
        </div>
        <div className="footer-col">
          <h4>Browse</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Furniture">Furniture</Link>
          <Link to="/products?category=Appliances">Appliances</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
          <Link to="/orders">My Rentals</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="footer-col">
          <h4>Cities</h4>
          <span>Bangalore</span>
          <span>Mumbai</span>
          <span>Delhi</span>
          <span>Kolkata</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Created by Ganesh Verma</p>
        <p>Built for CoderGanesh</p>
      </div>
    </div>
  </footer>
);

export default Footer;
