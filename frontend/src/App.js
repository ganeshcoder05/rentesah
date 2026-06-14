import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1A1A2E',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: '500',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              },
              success: {
                iconTheme: { primary: '#22C55E', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />
          <AppLayout>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected — logged in users */}
              <Route path="/cart" element={
                <ProtectedRoute><Cart /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
              <Route path="/order-success/:id" element={
                <ProtectedRoute><OrderSuccess /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><Orders /></ProtectedRoute>
              } />

              {/* Admin only */}
              <Route path="/admin" element={
                <AdminRoute><Admin /></AdminRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div className="empty-state" style={{ padding: '100px 24px' }}>
                  <div className="icon">🔍</div>
                  <h3>Page not found</h3>
                  <p>The page you're looking for doesn't exist</p>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </AppLayout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
