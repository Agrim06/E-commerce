import React, { useEffect, useState, useRef} from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBar({ initial= "" }){

    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState(initial || "");
    const timeRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const kw = params.get("keyword") || "";
        if(kw != value) setValue(kw);
    
    }, [location.search]);

    function applySearch(q) {
      const params = new URLSearchParams();
      if (q && q.trim()) params.set("keyword", q.trim());
      navigate(`/search?${params.toString()}`);
    }

    function onChange(e) {
        const v = e.target.value;
        setValue(v);

        if(timeRef.current) clearTimeout(timeRef.current);
        timeRef.current = setTimeout(() => applySearch(v), 10000);
    }

    function onSubmit(e) {
        e.preventDefault();
        if ( timeRef.current ) clearTimeout(timeRef.current);
        applySearch(value);   
    }

    function clear(){
        setValue("");
        if (timeRef.current) clearTimeout(timeRef.current);
        applySearch("");
    }

  return (
    <form className="search-form" onSubmit={onSubmit} role="search">
      <input
        className="search-input"
        type="search"
        placeholder="Search...."
        aria-label="Search products"
        value={value}
        onChange={onChange}
      />
      <button type="submit" className="search-btn" aria-label="Search">Search</button>
    </form>
  );
}

export default SearchBar;