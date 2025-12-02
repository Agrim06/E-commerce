import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load products from server."
        );
      } finally {
        setLoading(false);
      }
    }

    if(id) fetchProduct();
  }, [id]);

  function addToCart() {
    if (!product) return;
    try {
      const raw = localStorage.getItem("cart");
      let cart = raw ? JSON.parse(raw) : [];

      const existing = cart.find((it) => it._id === product._id);
      if (existing) {
        existing.qty = Number(existing.qty || 0) + 1;
      } else {
        cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  }

  if (loading) {
    return (
      <div className="container page">
        <p>Loading product…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page">
        <div className="form-error">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container page">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container page product-page">
      <div className="product-page-grid">

        <img src={product.image}
             className="product-page-img"   
             alt={product.name}
             />

        <div className="product-page-details">
          <h2 className="product-title">{product.name}</h2>

          <div className="price">
            ₹{product.price.toFixed(2) || 0 }
          </div>

          <p className="description">{product.description}</p>
          <button className="btn" onClick={addToCart}>Add to Cart</button>    
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

