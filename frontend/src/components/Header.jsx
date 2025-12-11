import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';


function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try{
      const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : null
    } catch{
      return null;
    }
  });

  useEffect(() => {
    function handleAuthChange() {
      try{
        const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch{
        setUser(null);
      }
    }

    window.addEventListener("authUserChanged", handleAuthChange);
    return () => {
      window.removeEventListener("authUserChanged", handleAuthChange);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.dispatchEvent(new Event("authUserChanged"));
    navigate('/login');
  }
  const initials = user && user.name
    ? user.name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase()
    : "";
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <Link to="/" className="logo">MyShop</Link>
          <p className="logo-subtitle">Curated essentials for modern living</p>
        </div>

        <div style={{ flex: 1, marginLeft: "20px", marginRight: "20px" }}>
          <SearchBar />
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="pill-link">Cart</Link>

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