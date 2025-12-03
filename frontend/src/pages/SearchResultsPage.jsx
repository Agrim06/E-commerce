import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../utils/api";

function SearchResultsPage(){
    
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    function getQueryKeyword(){
        const params = new URLSearchParams(location.search);
        return params.get("keyword") || "";
    }

    useEffect(() =>{
        const q = getQueryKeyword();
        if(q) setKeyword(q);

        async function fetchProducts(){
            setLoading(true);
            setError("");

            try {
                const url = q
                ? `/api/products?keyword=${encodeURIComponent(q)}`
                : "/api/products";
                const res = await api.get(url);
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
    }, [location.search]);

        return(
            <div className="container page">
                <h2 className="page-title"> Search Results</h2>

                {keyword && (
                    <p style={{ marginBottom: "1rem", fontSize: "1rem"}}>
                        Showing results for <strong>"{keyword}"</strong>
                    </p>
                )}

                {loading && <p>Loading products…</p>}
                
                {error && <diV className="form-error">{error}</diV>}

                {!loading && !error && products.length === 0 && (
                    <p>No products found. Try a different search.</p>
                )}

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
                <Link to={`/product/${p._id}`} className="btn btn-ghost">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResultsPage;