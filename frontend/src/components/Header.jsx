import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const initials = user?.name ? user.name[0]?.toUpperCase() : '';

  function handleLogout() {
    localStorage.removeItem('user');
    window.location.reload();
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <Link to="/" className="logo">MyShop</Link>
          <p className="logo-subtitle">Curated essentials for modern living</p>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/product/1">Shop</Link>
          <Link to="/cart">Cart</Link>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="pill-link">View Cart</Link>

          {user ? (
            <>
              <Link to="/profile" className="user-chip">
                <span className="avatar">{initials}</span>
                <span className="user-name">{user.name}</span>
              </Link>
              <button className="text-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
          )}

          <Link to="/admin" className="badge-link">Admin</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;