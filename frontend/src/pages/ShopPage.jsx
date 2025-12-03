import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../utils/api";

function ShopPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function getKeywordFromUrl(){
    const params = new URLSearchParams(location.search);
    return params.get("keyword") || "";
  }

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const keyword = getKeywordFromUrl();
        const url = keyword ? `/api/products?keyword=${encodeURIComponent(keyword)}` : `/api/products`;
        const res = await api.get(url);
        const list = Array.isArray(res.data) ? res.data : res.data.products;
        if(!cancelled) setProducts(list || []);
      } catch (err) {
        console.error(err);
        if(!cancelled)
          setError(
            err?.response?.data?.message || "Failed to load products from server."
          );
      } finally {
        if(!cancelled) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [location.search]);

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

      <section className="container page">

        <h2 className="page-title">All Products</h2>

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

export default ShopPage;
