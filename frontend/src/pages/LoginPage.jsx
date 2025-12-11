import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  console.log("Google Client ID in React:", GOOGLE_CLIENT_ID);
  console.log("window.google exists:", !!window.google);

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state && location.state.from) || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isValidEmail = (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

     useEffect(() =>{
      if(window.google && GOOGLE_CLIENT_ID){
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          {
            theme : "outline",
            size : "large",
            width : "100"
          }
        )
      }
    }, []);

    async function handleGoogleResponse(response) {
      try{
        setError("");
        setLoading(true);

        const { data } = await api.post("/api/users/google-login" , {
          idToken : response.credential,
        });

        localStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("authUserChanged"));
        navigate(from, {replace: true});
      }catch(err){
        console.log(err);
        setError(
          err?.response?.data?.message || "Google login failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
    
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address..");
            return;
        }

        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long..");
            return;
        }

        setLoading(true);

        try {

            const { data } = await api.post("/api/users/login" , {email, password});
            localStorage.setItem("user", JSON.stringify(data));
            
            window.dispatchEvent(new Event("authUserChanged"))
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    }






    return (
    <div className="container page form-page">
      <h1 className="page-title">Login</h1>

      <form className="form" onSubmit={handleSubmit} aria-label="login form" noValidate>
        {error && <div role="alert" className="form-error">{error}</div>}

        <label className="form-label">
          Email
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            aria-required="true"
          />
        </label>

        <label className="form-label">
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            aria-required="true"
          />
        </label>

        <div className="form-row">
          <Link to="/forgot" className="link">Forgot password?</Link>
        </div>

        <button className="btn form-btn" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div style={{ margin: "16px 0", textAlign: "center", color: "#6c757d" }}>
        <span>or</span>
      </div>

      {/* Google Sign In button */}
      <div id="googleSignInDiv" style={{ display: "flex", justifyContent: "center" }}></div>

      <p className="form-text">
        New here? <Link to="/register" className="link">Create an account</Link>
      </p>

    </div>
  );
}

export default LoginPage;