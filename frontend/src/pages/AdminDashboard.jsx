import { useState , useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";
import api from "../utils/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const[products, setProducts] = useState([]);
    const[loading, setLoading] = useState(false);
    const[saving, setSaving] = useState(false);
    const[error, setError] = useState("");
    const[formError, setFormError] = useState("");

    const[formData, setFormData] = useState({
        name: "",
        price: "",
        countInStock: "",
        image: "",
        brand: "",
        category: "",
        description: "",
        isFeatured: false,
    });

    useEffect(() => {
        const checkAdminStatus = async () => {
            const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
            
            if (!raw) {
                navigate("/login", { replace: true, state: { from: "/admin" } });
                return;
            }

            let user;
            try {
                user = JSON.parse(raw);
            } catch {
                navigate("/login", { replace: true });
                return;
            }

            if (user.isAdmin) {
                fetchProducts();
                return;
            }

            // If local storage says not admin, double check with server
            try {
                const { data } = await api.get("/api/users/profile");
                if (data.isAdmin) {
                    // Update local storage with fresh data
                    const updatedUser = { ...user, ...data };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    if (sessionStorage.getItem("user")) {
                        sessionStorage.setItem("user", JSON.stringify(updatedUser));
                    }
                    fetchProducts();
                } else {
                    navigate("/", { replace: true });
                }
            } catch (error) {
                console.error("Failed to verify admin status", error);
                navigate("/", { replace: true });
            }
        };

        checkAdminStatus();
    }, []); 

    async function fetchProducts() {
        setLoading(true);
        setError("");
        try{
            const res = await api.get("/api/products");

            const list = Array.isArray(res.data) ? res.data : res.data.products;
            setProducts( list || []);
        } catch (err){
            console.error(err);
            setError(
                err?.response?.data?.message || "Failed to load products from server."
            );
        } finally{
            setLoading(false);
            }
        }

        function handleChange(e) {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        async function handleCreateProduct(e) {
            e.preventDefault();
            setFormError("");

            if(!formData.name.trim() || !formData.price){
                setFormError("Name and price are required.");
                return;
            }

            setSaving(true);
            try{
                const payload = {
                    name : formData.name.trim(),
                    price : Number(formData.price),
                    countInStock : Number(formData.countInStock || 0),
                    image : formData.image.trim() || "https://via.placeholder.com/400",
                    brand: formData.brand.trim() || "Generic",
                    category: formData.category.trim() || "General",
                    description: formData.description.trim() || "No description", 
                    isFeatured: formData.isFeatured || false,
                };

                const res = await api.post("/api/products" , payload);
                const created = res.data;

                setProducts((prev) => [created, ...prev]);

                setFormData({
                    name: "",
                    price: "",
                    countInStock: "",
                    image: "",
                    brand: "",
                    category: "",
                    description: "",
                    isFeatured: false,
                });
            }catch(err){
                console.log(err);
                setFormError(
                    err?.response?.data?.message || "Failed to create Product"
                );
            }finally{
                setSaving(false);
            }
        }    
        async function handleDelete(id) {
            const ok = window.confirm(
                "Are you sure you want to delete this product? This cannot be undone."
            );

            if(!ok) return;
            
            try{
                await api.delete(`/api/products/${id}`);
                setProducts((prev) => prev.filter((p)=> p._id != id))
            }catch(err){
                console.log(err);
                alert(
                    err?.response?.data?.message || "Failed to delete product. Check console."
                );
            }
        }    
        return(
            <div className="container page admin-page">
            <div className="admin-header">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="admin-subtitle">
                Manage products: create, view, and delete items.
                </p>
            </div>

            {/* Create product panel */}
            <section className="admin-panel">
                <h2 className="admin-panel-title">Add New Product</h2>

                <form className="admin-form" onSubmit={handleCreateProduct}>
                {formError && <div className="form-error">{formError}</div>}

                <div className="admin-form-grid">
                    <label className="form-label">
                    Name
                    <input
                        className="input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product name"
                        required
                    />
                    </label>

                    <label className="form-label">
                    Price (₹)
                    <input
                        className="input"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="999.99"
                        required
                    />
                    </label>

                    <label className="form-label">
                    Stock
                    <input
                        className="input"
                        name="countInStock"
                        type="number"
                        value={formData.countInStock}
                        onChange={handleChange}
                        placeholder="10"
                    />
                    </label>

                    <label className="form-label">
                    Image URL
                    <input
                        className="input"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                    </label>

                    <label className="form-label">
                    Brand
                    <input
                        className="input"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Brand name"
                    />
                    </label>

                    <label className="form-label">
                    Category
                    <input
                        className="input"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Category"
                    />
                    </label>
                </div>

                <label className="form-label checkbox-label">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    />
                    <span>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    Feature on homepage
                    </label>

                <label className="form-label">
                    Description
                    <textarea
                    className="input admin-textarea"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Short description of the product..."
                    />
                </label>

                <button className="btn" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Create Product"}
                </button>
                </form>
            </section>

            {/* Product list */}
            <section className="admin-panel">
                <div className="admin-panel-header">
                <h2 className="admin-panel-title">Products</h2>
                {loading ? (
                    <span className="admin-badge">Loading...</span>
                ) : (
                    <span className="admin-badge">
                    Total: {products.length} product{products.length !== 1 && "s"}
                    </span>
                )}
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="admin-table-wrapper">
                {loading ? (
                    <p>Loading products...</p>
                ) : products.length === 0 ? (
                    <p>No products found. Add one above.</p>
                ) : (
                    <table className="admin-table">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Price (₹)</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th className="admin-actions-cell">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                        <tr key={p._id}>
                            <td>{p.name}</td>
                            <td>{Number(p.price).toFixed(2)}</td>
                            <td>{p.countInStock}</td>
                            <td>{p.category || "-"}</td>
                            <td className="admin-actions-cell">
                           
                            <button
                                type="button"
                                className="btn admin-btn-delete"
                                onClick={() => handleDelete(p._id)}
                            >
                                Delete
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
                </div>
            </section>
            </div>
        );
    }
export default AdminDashboard;