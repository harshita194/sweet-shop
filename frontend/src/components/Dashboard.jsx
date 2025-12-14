import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import SweetCard from "./SweetCard";
import SearchFilters from "./SearchFilters";
import AdminPanel from "./AdminPanel";
import Logo from "./Logo";

const Dashboard = () => {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect if not authenticated (should be handled by ProtectedRoute, but safety check)
  if (!user) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterSweets();
  }, [sweets, searchParams]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/sweets");
      setSweets(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load sweets. Please check your connection.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterSweets = () => {
    let filtered = [...sweets];

    if (searchParams.name) {
      filtered = filtered.filter((sweet) =>
        sweet.name.toLowerCase().includes(searchParams.name.toLowerCase())
      );
    }

    if (searchParams.category) {
      filtered = filtered.filter((sweet) =>
        sweet.category.toLowerCase().includes(searchParams.category.toLowerCase())
      );
    }

    if (searchParams.minPrice) {
      filtered = filtered.filter(
        (sweet) => sweet.price >= parseFloat(searchParams.minPrice)
      );
    }

    if (searchParams.maxPrice) {
      filtered = filtered.filter(
        (sweet) => sweet.price <= parseFloat(searchParams.maxPrice)
      );
    }

    setFilteredSweets(filtered);
  };

  const handlePurchase = async (sweetId) => {
    try {
      await api.post(`/sweets/${sweetId}/purchase`, { quantity: 1 });
      await fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed. Please try again.");
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setShowAdminPanel(true);
  };

  const handleDelete = async (sweetId) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) {
      return;
    }

    try {
      await api.delete(`/sweets/${sweetId}`);
      await fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete sweet");
    }
  };

  const handleRestock = async (sweet) => {
    const quantity = prompt(`Enter quantity to add to ${sweet.name}:`, "10");
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      return;
    }

    try {
      await api.post(`/sweets/${sweet._id}/restock`, {
        quantity: parseInt(quantity),
      });
      await fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to restock");
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchParams.name) params.append("name", searchParams.name);
      if (searchParams.category) params.append("category", searchParams.category);
      if (searchParams.minPrice) params.append("minPrice", searchParams.minPrice);
      if (searchParams.maxPrice) params.append("maxPrice", searchParams.maxPrice);

      const response = await api.get(`/sweets/search?${params.toString()}`);
      setSweets(response.data || []);
      setError("");
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchParams({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    fetchSweets();
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo-link">
            <Logo />
          </Link>
          
          {/* Search Bar in Navbar */}
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchParams.name}
              onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="navbar-search-input"
            />
            <button onClick={handleSearch} className="navbar-search-btn">
              🔍
            </button>
          </div>

          {/* Filter Button (Amazon Style) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="navbar-filter-toggle-btn"
            title="Show/Hide Filters"
          >
            <span>🔍 Filters</span>
            <span className="filter-count">
              {[searchParams.category, searchParams.minPrice, searchParams.maxPrice].filter(Boolean).length > 0 && (
                <span className="filter-badge">
                  {[searchParams.category, searchParams.minPrice, searchParams.maxPrice].filter(Boolean).length}
                </span>
              )}
            </span>
          </button>

          <div className="navbar-actions">
            <div className="user-info">
              <span className="user-name">Hi, {user?.name}</span>
              <span className={`role-badge ${isAdmin ? "admin" : ""}`}>
                {isAdmin ? "👑 Admin" : "👤 Customer"}
              </span>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className={`btn ${showAdminPanel ? "btn-primary" : "btn-secondary"}`}
                style={{ fontWeight: showAdminPanel ? "bold" : "normal" }}
              >
                {showAdminPanel ? "⚙️ Admin Panel (Open)" : "⚙️ Admin Panel"}
              </button>
            )}
            <button onClick={() => { logout(); navigate("/"); }} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to SweetShop</h1>
          <p className="hero-subtitle">Discover the finest collection of Indian sweets, chocolates, ice creams, shakes, cakes, and cookies</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Filters Section - Amazon Style */}
          {showFilters && (
            <SearchFilters
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />
          )}

          {/* Admin Panel - Always visible for admin, collapsible */}
          {isAdmin && (
            <div className="admin-panel-toggle-section">
              {showAdminPanel && (
                <AdminPanel 
                  onRefresh={fetchSweets} 
                  editingSweet={editingSweet}
                  onEditComplete={() => setEditingSweet(null)}
                  allSweets={sweets}
                />
              )}
            </div>
          )}


          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Products Section */}
          <section className="products-section" id="products">
            <div className="section-header">
              <h2 className="section-title">Our Collection</h2>
              <span className="product-count">
                {loading ? "Loading..." : `${filteredSweets.length} products`}
              </span>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading sweets...</p>
              </div>
            ) : filteredSweets.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🍬</div>
                <h3>No sweets found</h3>
                <p>
                  {sweets.length === 0 
                    ? "No sweets available. Add some sweets as an admin to get started!"
                    : "Try adjusting your search filters."}
                </p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredSweets.map((sweet) => (
                  <SweetCard
                    key={sweet._id}
                    sweet={sweet}
                    onPurchase={handlePurchase}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRestock={handleRestock}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <Logo />
              <p className="footer-description">
                Your one-stop destination for premium Indian sweets, chocolates, and ice creams.
              </p>
            </div>
            <div className="footer-section">
              <h4>Categories</h4>
              <ul className="footer-links">
                <li><a href="#products">Sweets</a></li>
                <li><a href="#products">Chocolates</a></li>
                <li><a href="#products">Ice Creams</a></li>
                <li><a href="#products">Shakes</a></li>
                <li><a href="#products">Cakes</a></li>
                <li><a href="#products">Cookies</a></li>
                {isAdmin && <li><a href="#admin">Admin Panel</a></li>}
              </ul>
            </div>
            <div className="footer-section">
              <h4>Account</h4>
              <ul className="footer-links">
                <li>{user?.name}</li>
                <li>{user?.email}</li>
                <li><button onClick={logout} className="footer-link-btn">Logout</button></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SweetShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
