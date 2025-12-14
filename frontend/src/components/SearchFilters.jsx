const SearchFilters = ({ searchParams, setSearchParams, onSearch, onClear }) => {
  const handleChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const categories = ["Sweets", "Chocolates", "Ice Creams", "Shakes", "Cakes", "Cookies"];

  return (
    <div className="filters-section" id="filters">
      <div className="filters-content">
        <div className="filters-header-text">
          <h3>🔍 Filter Products</h3>
          <p>Refine your search by category and price range</p>
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={searchParams.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="minPrice">Min Price (₹)</label>
            <input
              type="number"
              id="minPrice"
              value={searchParams.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price (₹)</label>
            <input
              type="number"
              id="maxPrice"
              value={searchParams.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
              placeholder="1000"
              min="0"
              step="0.01"
              className="filter-input"
            />
          </div>
        </div>
        
        <div className="filter-actions">
          <button onClick={onSearch} className="btn btn-primary">
            🔍 Apply Filters
          </button>
          <button onClick={onClear} className="btn btn-secondary">
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
