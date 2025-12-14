import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import SweetCard from "./SweetCard";
import SearchFilters from "./SearchFilters";
import Logo from "./Logo";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

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
      setError("Failed to load products. Please check your connection.");
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
    if (!user) {
      navigate("/login");
      return;
    }
    
    try {
      await api.post(`/sweets/${sweetId}/purchase`, { quantity: 1 });
      await fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed. Please try again.");
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
            {user ? (
              <>
                <div className="user-info">
                  <span className="user-name">Hi, {user?.name}</span>
                  <span className={`role-badge ${user?.role === "admin" ? "admin" : ""}`}>
                    {user?.role === "admin" ? "👑 Admin" : "👤 Customer"}
                  </span>
                </div>
                <Link to="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to SweetShop</h1>
          <p className="hero-subtitle">
            Discover the finest collection of Indian sweets, chocolates, ice creams, shakes, cakes, and cookies
          </p>
          {!user && (
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>
                Login
              </Link>
            </div>
          )}
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
                <p>Loading products...</p>
              </div>
            ) : filteredSweets.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🍬</div>
                <h3>No products found</h3>
                <p>
                  {sweets.length === 0 
                    ? "No products available. Please check back later!"
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
                    isAdmin={false}
                    showLoginPrompt={!user}
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
                Your one-stop destination for premium Indian sweets, chocolates, ice creams, shakes, cakes, and cookies.
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
              </ul>
            </div>
            <div className="footer-section">
              <h4>Account</h4>
              <ul className="footer-links">
                {user ? (
                  <>
                    <li>{user?.name}</li>
                    <li>{user?.email}</li>
                    <li><Link to="/dashboard">Go to Dashboard</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </>
                )}
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

export default Home;

