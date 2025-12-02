import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const highlights = [
    {
      title: "Everyday uniforms",
      description: "Layerable basics built to pair with anything in your wardrobe.",
    },
    {
      title: "Cold-weather ready",
      description: "Thermal-knit fabrics, insulated outers, and wind-resistant finishes.",
    },
    {
      title: "Conscious materials",
      description: "Organic cotton, recycled blends, and low-impact dye processes.",
    },
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/products");
        const list = Array.isArray(res.data) ? res.data : res.data.products;
        setProducts(list || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load products from server."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  function addToCart(product, qty = 1) {
    try {
      const raw = localStorage.getItem("cart");
      let cart = raw ? JSON.parse(raw) : [];

      const existing = cart.find((it) => it._id === product._id);
      if (existing) {
        existing.qty = Number(existing.qty || 0) + Number(qty);
      } else {
        cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: Number(qty),
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  }

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

        <h2 className="page-title">Featured products</h2>

        {loading && <p>Loading products…</p>}
        {error && <div className="form-error" style={{ marginBottom: "1rem" }}>{error}</div>}
        {!loading && !error && products.length === 0 && <p>No products found.</p>}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p._id} className="product-card">
                <Link to={`/product/${p._id}`}>
                  <img src={p.image} className="product-img" alt={p.name} />
                </Link>
                <div className="product-info">
                  <Link to={`/product/${p._id}`} className="product-name">
                    {p.name}
                  </Link>
                  <div className="product-price">₹{Number(p.price).toFixed(2)}</div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <button className="btn" onClick={() => addToCart(p, 1)}>
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${p._id}`}
                      className="btn btn-ghost"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
