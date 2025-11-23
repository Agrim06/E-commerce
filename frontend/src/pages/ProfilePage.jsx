import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // full user object
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // load user from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        // not logged in -> redirect to login
        navigate("/login", { replace: true });
        return;
      }
      const parsed = JSON.parse(raw);
      setUser(parsed);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
    } catch (err) {
      console.error(err);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // simple email validator
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) return setError("Name cannot be empty.");
    if (!isValidEmail(email)) return setError("Please enter a valid email.");

    // if user wants to change password, basic checks
    if (newPassword && newPassword.length < 6) return setError("New password must be at least 6 characters.");

    setLoading(true);
    try {
      // --- Option A: real API ---
      const token = user.token;
      const { data } = await api.put('/api/users/profile', { name, email, currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // server should return updated user
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setMessage('Profile updated successfully.');

      // clear password fields
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <div className="container page">Loading...</div>;
  }

  return (
    <div className="container page form-page">
      <h1 className="page-title">My Profile</h1>

      {message && <div className="form-error" style={{ background: "#e6ffed", borderColor: "#b6f0c9", color: "#0a7a3a" }}>{message}</div>}
      {error && <div className="form-error">{error}</div>}

      <form className="form" onSubmit={handleUpdate}>
        <label className="form-label">
          Name
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label className="form-label">
          Email
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid #eee" }} />

        <label className="form-label">
          Current password (required to change)
          <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </label>

        <label className="form-label">
          New password
          <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </label>

        <button className="btn form-btn" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
export default ProfilePage