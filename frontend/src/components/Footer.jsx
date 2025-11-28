import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-logo">MyShop</p>
          <p className="footer-text">Thoughtful products curated for everyday luxury.</p>
        </div>

        <div className="footer-links">
          <a href="mailto:hello@myshop.com">Support</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
        </div>

        <p className="footer-copy">© {new Date().getFullYear()} MyShop. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;