import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const sampleProducts = [
    { _id: '1', name: 'Sample Product A', price: 99.99, image: '/images/product1.jpg' },
    { _id: '2', name: 'Sample Product B', price: 49.99, image: '/images/product2.jpg' },
    { _id: '3', name: 'Sample Product C', price: 29.99, image: '/images/product3.jpg' },
  ];

  const highlights = [
    { title: 'Free shipping', description: 'Complimentary delivery on orders over $50' },
    { title: 'Carbon neutral', description: 'Sustainable packaging for every shipment' },
    { title: '48h dispatch', description: 'Fast fulfilment from local warehouses' },
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-card">
          <div>
            <p className="eyebrow">Winter 2025 Capsule</p>
            <h1 className="hero-title">Design-led essentials for modern living</h1>
            <p className="hero-copy">
              Discover elevated pieces crafted with premium materials, clean silhouettes, and thoughtful detailing.
              Built to move seamlessly from home to city.
            </p>
          </div>

          <div className="hero-actions">
            <Link to="/product/1" className="btn">Shop new arrivals</Link>
            <Link to="/product/2" className="link-arrow">
              View lookbook <span>→</span>
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <p className="stat-value">4.9/5</p>
              <p className="stat-label">Customer satisfaction</p>
            </div>
            <div>
              <p className="stat-value">120K+</p>
              <p className="stat-label">Orders fulfilled</p>
            </div>
            <div>
              <p className="stat-value">72h</p>
              <p className="stat-label">Average delivery time</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container page">
        <div className="curation-grid">
          {highlights.map((item) => (
            <div key={item.title} className="curation-card">
              <p className="eyebrow">{item.title}</p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="page-title">Featured products</div>
        <div className="product-grid">
          {sampleProducts.map((p) => (
            <div key={p._id} className="product-card">
              <Link to={`/product/${p._id}`}>
                <img src={p.image} alt={p.name} className="product-img" />
              </Link>
              <div className="product-info">
                <Link to={`/product/${p._id}`} className="product-name">{p.name}</Link>
                <p className="product-desc">Performance fabrics, minimal finish, timeless fit.</p>
                <div className="product-bottom">
                  <div className="product-price">${p.price.toFixed(2)}</div>
                  <button className="btn btn-ghost">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;