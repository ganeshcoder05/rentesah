import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const { login, loading } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      await fetchCart();
      toast.success(`Welcome back, ${result.data.name.split(' ')[0]}!`);
      navigate(result.data.role === 'admin' ? '/admin' : '/products');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span>🏠</span>
          <h1>Rent<span>Ease</span></h1>
        </div>
        <h2>Welcome back</h2>
        <p className="auth-sub">Login to manage your rentals</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up free</Link>
        </p>

        <div className="demo-credentials">
          <p>creater <strong>ganpati1065@gmail.com</strong> / <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
