import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Header with nav links and cart badge
function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="container navbar">
        <NavLink to="/" className="brand">KaviaShop</NavLink>
        <NavLink to="/products" className={({isActive})=>`nav-link ${isActive ? 'active' : ''}`}>Products</NavLink>
        <div className="nav-spacer" />
        <NavLink to="/cart" className={({isActive})=>`nav-link ${isActive ? 'active' : ''}`}>Cart <span className="badge" aria-label={`Cart count ${cartCount}`}>{cartCount}</span></NavLink>
        {user ? (
          <>
            <NavLink to="/orders" className={({isActive})=>`nav-link ${isActive ? 'active' : ''}`}>Orders</NavLink>
            <NavLink to="/profile" className={({isActive})=>`nav-link ${isActive ? 'active' : ''}`}>{user.name?.split(' ')[0] || 'Account'}</NavLink>
            <button className="btn" onClick={logout} aria-label="Logout">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({isActive})=>`nav-link ${isActive ? 'active' : ''}`}>Login</NavLink>
            <NavLink to="/register" className={({isActive})=>`nav-link ${isActive ? 'active' : ''}`}>Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container row wrap">
        <div>© {new Date().getFullYear()} KaviaShop</div>
        <div className="nav-spacer" />
        <a href="#contact" className="nav-link">Contact</a>
        <a href="#privacy" className="nav-link">Privacy</a>
        <a href="#terms" className="nav-link">Terms</a>
      </div>
    </footer>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container"><div className="skeleton" style={{height: 120}} /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
function App() {
  /** Main app with providers and router. */
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <main className="main">
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                } />
                <Route path="/orders" element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
