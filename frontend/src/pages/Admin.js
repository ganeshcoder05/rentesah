import React, { useState, useEffect } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import './Admin.css';

const statusOptions = ['Pending', 'Confirmed', 'Delivered', 'Active', 'Return Requested', 'Returned', 'Cancelled'];

const statusColors = {
  Pending: 'badge-yellow',
  Confirmed: 'badge-purple',
  Delivered: 'badge-green',
  Active: 'badge-green',
  'Return Requested': 'badge-yellow',
  Returned: 'badge-purple',
  Cancelled: 'badge-red'
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', category: 'Furniture', subcategory: 'Bed',
    description: '', monthlyRent: '', securityDeposit: '',
    brand: '', condition: 'New', availableQuantity: 1, city: 'Bangalore',
    images: '', features: '',
    tenureOptions: [
      { months: 3, label: '3 Months' },
      { months: 6, label: '6 Months' },
      { months: 12, label: '12 Months' }
    ]
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, usersRes, productsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/orders'),
        API.get('/admin/users'),
        API.get('/products?limit=100')
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data.orders);
      setUsers(usersRes.data);
      setProducts(productsRes.data.products);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSeedProducts = async () => {
    setSeeding(true);
    try {
      const { data } = await API.post('/admin/seed');
      toast.success(`${data.message}`);
      fetchAll();
    } catch (err) {
      toast.error('Seeding failed');
    } finally {
      setSeeding(false);
    }
  };

  const handleProductFormChange = e => {
    setProductForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleAddProduct = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        monthlyRent: Number(productForm.monthlyRent),
        securityDeposit: Number(productForm.securityDeposit),
        availableQuantity: Number(productForm.availableQuantity),
        images: productForm.images ? [productForm.images] : [],
        features: productForm.features ? productForm.features.split(',').map(f => f.trim()) : []
      };
      await API.post('/products', payload);
      toast.success('Product added!');
      setShowProductForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product removed');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Failed to remove product');
    }
  };

  const formatPrice = p => `₹${Number(p).toLocaleString('en-IN')}`;
  const formatDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading admin panel...</p></div>;

  const subcatOptions = productForm.category === 'Furniture'
    ? ['Bed', 'Sofa', 'Table']
    : ['Fridge', 'Washing Machine', 'TV'];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p>Manage products, orders and users</p>
          </div>
          <button className="btn btn-outline" onClick={handleSeedProducts} disabled={seeding}>
            {seeding ? 'Seeding...' : '🌱 Seed Sample Products'}
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['dashboard', 'orders', 'products', 'users'].map(tab => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div>
                  <p className="stat-label">Total Users</p>
                  <p className="stat-value">{stats.totalUsers}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div>
                  <p className="stat-label">Active Products</p>
                  <p className="stat-value">{stats.totalProducts}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div>
                  <p className="stat-label">Total Orders</p>
                  <p className="stat-value">{stats.totalOrders}</p>
                </div>
              </div>
              <div className="stat-card highlight">
                <div className="stat-icon">💰</div>
                <div>
                  <p className="stat-label">Monthly Revenue</p>
                  <p className="stat-value">{formatPrice(stats.monthlyRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="recent-orders-section">
              <h2>Recent Orders</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map(order => (
                    <tr key={order._id}>
                      <td className="order-id-cell">#{order._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <p className="table-user-name">{order.user?.name}</p>
                        <p className="table-user-email">{order.user?.email}</p>
                      </td>
                      <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                      <td><strong>{formatPrice(order.totalAmount)}</strong></td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td><span className={`badge ${statusColors[order.status] || 'badge-purple'}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Amount</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td className="order-id-cell">#{order._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <p className="table-user-name">{order.user?.name}</p>
                      <p className="table-user-email">{order.user?.phone || order.user?.email}</p>
                    </td>
                    <td>{order.deliveryAddress?.city}</td>
                    <td><strong>{formatPrice(order.totalAmount)}</strong></td>
                    <td>{formatDate(order.deliveryDate)}</td>
                    <td><span className={`badge ${statusColors[order.status] || 'badge-purple'}`}>{order.status}</span></td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="tab-action-bar">
              <p>{products.length} products</p>
              <button className="btn btn-primary" onClick={() => setShowProductForm(!showProductForm)}>
                {showProductForm ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {showProductForm && (
              <form className="product-form" onSubmit={handleAddProduct}>
                <h3>Add New Product</h3>
                <div className="pf-grid">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input name="name" value={productForm.name} onChange={handleProductFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>Brand</label>
                    <input name="brand" value={productForm.brand} onChange={handleProductFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={productForm.category} onChange={handleProductFormChange}>
                      <option>Furniture</option>
                      <option>Appliances</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Subcategory *</label>
                    <select name="subcategory" value={productForm.subcategory} onChange={handleProductFormChange}>
                      {subcatOptions.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Monthly Rent (₹) *</label>
                    <input type="number" name="monthlyRent" value={productForm.monthlyRent} onChange={handleProductFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>Security Deposit (₹) *</label>
                    <input type="number" name="securityDeposit" value={productForm.securityDeposit} onChange={handleProductFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
                    <select name="condition" value={productForm.condition} onChange={handleProductFormChange}>
                      <option>New</option>
                      <option>Like New</option>
                      <option>Good</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity Available</label>
                    <input type="number" name="availableQuantity" value={productForm.availableQuantity} onChange={handleProductFormChange} min="0" />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input name="city" value={productForm.city} onChange={handleProductFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input name="images" value={productForm.images} onChange={handleProductFormChange} placeholder="https://..." />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea name="description" value={productForm.description} onChange={handleProductFormChange} rows={3} required />
                </div>
                <div className="form-group">
                  <label>Features (comma-separated)</label>
                  <input name="features" value={productForm.features} onChange={handleProductFormChange} placeholder="Feature 1, Feature 2, Feature 3" />
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
              </form>
            )}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Rent/mo</th>
                  <th>Deposit</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="badge badge-purple">{p.subcategory}</span></td>
                    <td>{p.brand}</td>
                    <td>{formatPrice(p.monthlyRent)}</td>
                    <td>{formatPrice(p.securityDeposit)}</td>
                    <td>
                      <span className={p.availableQuantity > 0 ? 'stock-good' : 'stock-bad'}>
                        {p.availableQuantity}
                      </span>
                    </td>
                    <td>
                      <button className="btn-del" onClick={() => handleDeleteProduct(p._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="table-user-avatar">{u.name?.charAt(0).toUpperCase()}</div>
                      <strong>{u.name}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
