import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    return (
        <header className="header">
            <div className="container header-inner">
            <Link to="/" className="logo">MyShop</Link>
                <nav className="nav-links">
                <Link to="/cart">Cart</Link>
                {user ? (
                <>
                <Link to="/profile">{user.name}</Link>
                <button className="logout-btn" onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}>Logout</button>
                </>
                ) : (
                <Link to="/login">Login</Link>
                )}
                <Link to="/admin" className="admin-btn">Admin</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;