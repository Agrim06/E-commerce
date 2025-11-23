import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; 

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // client side validation
    if (!name.trim()) return setError("Please enter your name.");
    if (!isValidEmail(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const { data } = await api.post("/api/users/register", { name, email, password });
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page form-page">
      <h1 className="page-title">Create an account</h1>

      <form className="form" onSubmit={handleSubmit} noValidate>
        {error && <div className="form-error">{error}</div>}

        <label className="form-label">
          Name
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        </label>

        <label className="form-label">
          Email
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>

        <label className="form-label">
          Password
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
        </label>

        <label className="form-label">
          Confirm password
          <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </label>

        <button className="btn form-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="form-text">Already have an account? <a href="/login" className="link">Sign in</a></p>
    </div>
  );
}


export default RegisterPage;