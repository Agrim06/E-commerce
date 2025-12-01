import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api"

function HomePage() {

  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() =>{
    async function fetchProducts() {
      setLoading(true);
      setError("")

      try{
        const res = await api.get("/api/products");   
        const list = Array.isArray(res.data) ? res.data : res.data.products;
        setProducts(list || []);
      }catch(err){
        console.log(err);
        setError(
          err?.response?.data?.message || "Failed to load products from server."
        );
      }finally{
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    function updateCartCount() {
      try {
        const raw = localStorage.getItem("cart");
        if (raw) {
          const parsed = JSON.parse(raw);
          const totalQty = parsed.reduce(
            (s, it) => s + Number(it.qty || 0),
            0
          );
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    }

    updateCartCount();

    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  function addToCart(product, qty = 1){
    try{
      const raw = localStorage.getItem("cart");
      let cart = raw?JSON.parse(raw) :[];

      const exisiting = cart.find((it) => it._id === product._id);
      if(exisiting){
        exisiting.qty = Number(exisiting.qty) + Number(qty);
      }else{
        cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: Number(qty),
        });
      }
       localStorage.setItem("cart", JSON.stringify(cart));

    const totalQty = cart.reduce((s, it) => s + Number(it.qty || 0), 0);
    setCartCount(totalQty);

  } catch (err) {
    console.error("Failed to add to cart:", err);
    }
  }

  const highlights = [
    {
      title: "New Arrivals",
      description: "Check out our latest products.",
    },
    {
      title: "Best Sellers",
      description: "See what everyone's buying.",
    },
    {
      title: "On Sale",
      description: "Get the best deals.",
    },
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
          {products.map((p)=>(
            <div className="product-card">
              <Link to={`/product/${p._id}`}>
                <img src = {p.image} />
              </Link>
              <div className="product-info">
              <Link to={`/product/${p._id}`}>{p.name}</Link>
              <div className="product-price">₹{p.price.toFixed(2)}</div>

              <button className="btn" onClick={() => addToCart(p, 1)}>Add to Cart</button>
              <Link to={`/product/${p._id}`} className="btn">View</Link>
            </div>
          </div>  
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;