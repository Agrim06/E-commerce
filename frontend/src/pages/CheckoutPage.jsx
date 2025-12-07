import React, {useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api"

function CheckoutPage(){

    const navigate = useNavigate();

    const[ cart, setCart ] = useState([]);
    const[ user, setUser ] = useState(null);

    const[ fullName, setFullName ] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if(!rawUser){
            navigate("/login", {replace: true, state: { from : "/checkout" }}) ;
            return;
        }
        try{
            const parsedUser = JSON.parse(rawUser);
            setUser(parsedUser);
        }catch{
            navigate("/login" , {replace: true , state: { from: "/checkout" }});
            return;
        }


        try{
            const rawCart = localStorage.getItem("cart")
            const parsedCart = rawCart ? JSON.parse(rawCart) : [];
            if(!parsedCart.length){
                navigate("/cart" , {replace: true});
                return;
            }

            setCart(parsedCart);
        }catch{
            navigate("/cart", {replace: true});
        }
    }, [navigate])

    const itemPrice = cart.reduce(
        (sum, it) => sum + Number(it.price || 0) * Number(it.qty || 0),
        0
    );
    const shippingPrice = itemPrice > 2000 ? 0 : 99;
    const taxPrice = Math.round(itemPrice * 0.18); // 18% GST-ish
    const totalPrice = itemPrice + shippingPrice + taxPrice;
    const itemsCount = cart.reduce((s, it) => s + Number(it.qty || 0), 0);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if(!fullName.trim() || !address.trim() || !city.trim() || !postalCode.trim() || !country.trim()){
            setError("Please fill in all shipping details.");
            return;
        }

        if (!cart.length) {
            setError("Your cart is empty.");
            return;
        }
        setLoading(true);

        try{
            const payload = {
                orderItems : cart.map((it) => ({
                    product: it._id,
                    name: it.name,
                    image: it.image,
                    price: it.price,
                    qty: it.qty,
                  
                })),
                shippingAddress : {
                    fullName: fullName.trim(),
                    address: address.trim(),
                    city: city.trim(),
                    postalCode: postalCode.trim(),
                    country: country.trim(),
                },
                paymentMethod,
                itemPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            };

            const { data } = await api.post("/api/orders", payload);

            localStorage.removeItem("cart");

            if(data && data._id){
                navigate(`/order/${data._id}`);
            }else{
                navigate("/");
            }
        } catch(err) {
            console.log(err);
            setError(
                err?.response?.data?.message ||
                "Failed to place order Please try again later!"
            );
        } finally {
            setLoading(false)
        }
    };

    return(
        <div className="container page">
      <h1 className="page-title">Checkout</h1>

      <div className="cart-layout">
        {/* LEFT: shipping / payment form */}
        <div className="cart-left">
          <form className="form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <h2 style={{ marginBottom: "0.5rem" }}>Shipping details</h2>

            <label className="form-label">
              Full name
              <input
                className="input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </label>

            <label className="form-label">
              Address
              <input
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, area"
              />
            </label>

            <label className="form-label">
              City
              <input
                className="input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </label>

            <label className="form-label">
              Postal code
              <input
                className="input"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="PIN code"
              />
            </label>

            <label className="form-label">
              Country
              <input
                className="input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </label>

            <h2 style={{ margin: "1.5rem 0 0.5rem" }}>Payment method</h2>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={paymentMethod === "Card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Card / UPI (demo only)
              </label>
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Placing order…" : "Place order"}
            </button>
          </form>
        </div>

        {/* RIGHT: order summary */}
        <aside className="cart-right">
          <div className="order-summary">
            <h3>Order summary</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              {itemsCount} item{itemsCount !== 1 ? "s" : ""} in your cart
            </p>

            <div className="summary-line">
              <span>Items</span>
              <span>₹{itemPrice.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? "Free" : `₹${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div className="summary-line">
              <span>Tax (18%)</span>
              <span>₹{taxPrice.toFixed(2)}</span>
            </div>

            <div className="summary-line" style={{ borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 8 }}>
              <strong>Total</strong>
              <strong>₹{totalPrice.toFixed(2)}</strong>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <Link to="/cart" className="link">
                ← Back to cart
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
