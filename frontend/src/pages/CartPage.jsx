import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();

  const sampleCart = [
    { _id: "1", name: "Sample Product A", price: 99.99, image: "https://via.placeholder.com/120", qty: 2 },
    { _id: "2", name: "Sample Product B", price: 49.5, image: "https://via.placeholder.com/120", qty: 1 },
  ];

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : sampleCart;
    } catch (err) {
      return sampleCart;
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function updateQty(itemId, newQty) {
    setCart((prev) => prev.map((it) => (it._id === itemId ? { ...it, qty: Math.max(1, newQty) } : it)));
  }

  function removeItem(itemId) {
    setCart((prev) => prev.filter((it) => it._id !== itemId));
  }

  function clearCart() {
    setCart([]);
  }

  const itemsCount = cart.reduce((s, it) => s + Number(it.qty || 0), 0);
  const subtotal = cart.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 0), 0);

  function handleProceed() {
    navigate("/checkout");
  }

  return (
    <div className="container page">
      <h1 className="page-title">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty!</p>
          <Link to="/" className="btn">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-left">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <div className="cart-item-price">₹{Number(item.price).toFixed(2)}</div>

                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>

                    <input
                      className="qty-input"
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value || "1", 10);
                        if (!Number.isNaN(val)) updateQty(item._id, val);
                      }}
                    />

                    <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)} aria-label={`Increase quantity of ${item.name}`}>＋</button>
                  </div>

                  <div className="cart-item-actions">
                    <button className="link-btn" onClick={() => removeItem(item._id)}>Remove</button>
                  </div>
                </div>

                <div className="cart-item-total">₹{(Number(item.price) * Number(item.qty)).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <aside className="cart-right">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Items</span>
                <span>{itemsCount}</span>
              </div>
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-actions">
                <button className="btn checkout-btn" onClick={handleProceed}>Proceed to checkout</button>
                <button className="btn ghost-btn" onClick={clearCart}>Clear Cart</button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default CartPage;
