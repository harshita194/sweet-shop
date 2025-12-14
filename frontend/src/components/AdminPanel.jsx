import { useState, useEffect } from "react";
import api from "../services/api";

const AdminPanel = ({ onRefresh, editingSweet: propEditingSweet, onEditComplete, allSweets = [] }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(propEditingSweet || null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "",
  });
  const [restockData, setRestockData] = useState({ sweetId: "", quantity: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (propEditingSweet) {
      setEditingSweet(propEditingSweet);
      setFormData({
        name: propEditingSweet.name,
        category: propEditingSweet.category,
        price: propEditingSweet.price.toString(),
        quantity: propEditingSweet.quantity.toString(),
        image: propEditingSweet.image || "",
      });
      setShowAddForm(true);
    }
  }, [propEditingSweet]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSweet = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/sweets", {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image: formData.image || "",
      });
      setFormData({ name: "", category: "", price: "", quantity: "", image: "" });
      setShowAddForm(false);
      setEditingSweet(null);
      if (onEditComplete) onEditComplete();
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add sweet");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSweet = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.put(`/sweets/${editingSweet._id}`, {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image: formData.image || "",
      });
      setEditingSweet(null);
      setFormData({ name: "", category: "", price: "", quantity: "", image: "" });
      if (onEditComplete) onEditComplete();
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update sweet");
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate product ID format (MongoDB ObjectId is 24 hex characters)
    const productId = restockData.sweetId.trim();
    if (!productId || productId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(productId)) {
      setError("Invalid product ID. Please select from dropdown or enter a valid 24-character ID.");
      setLoading(false);
      return;
    }

    try {
      await api.post(`/sweets/${productId}/restock`, {
        quantity: parseInt(restockData.quantity),
      });
      setRestockData({ sweetId: "", quantity: "" });
      setError(""); // Clear any previous errors
      onRefresh();
      alert("Product restocked successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to restock";
      setError(errorMsg);
      if (errorMsg.includes("not found")) {
        setError("Product not found. Please check the product ID or select from dropdown.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingSweet(null);
    setFormData({ name: "", category: "", price: "", quantity: "" });
    setError("");
    if (onEditComplete) onEditComplete();
  };

  return (
    <div className="admin-panel" id="admin">
      <h2>⚙️ Product Management Panel</h2>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
        Manage your inventory: Add, edit, delete, and restock products (Sweets, Chocolates, Ice Creams)
      </p>
      
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) cancelForm();
          }}
          className="btn btn-primary"
        >
          {showAddForm ? "Cancel" : "+ Add New Product"}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-section">
          <h3>{editingSweet ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={editingSweet ? handleUpdateSweet : handleAddSweet}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Gulab Jamun, Cadbury, Kulfi"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}
                >
                  <option value="">Select Category</option>
                  <option value="Sweets">Sweets</option>
                  <option value="Chocolates">Chocolates</option>
                  <option value="Ice Creams">Ice Creams</option>
                  <option value="Shakes">Shakes</option>
                  <option value="Cakes">Cakes</option>
                  <option value="Cookies">Cookies</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input
                type="url"
                name="image"
                value={formData.image || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Saving..." : editingSweet ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      )}

      <div className="admin-form-section">
        <h3>📦 Quick Restock</h3>
        <p style={{ color: "#6b7280", marginBottom: "1rem", fontSize: "0.875rem" }}>
          Select a product from the list below or enter the product ID manually. Product IDs are also shown on each product card.
        </p>
        <form onSubmit={handleRestock}>
          <div className="form-row">
            <div className="form-group">
              <label>Select Product or Enter ID</label>
              {allSweets.length > 0 ? (
                <select
                  value={restockData.sweetId}
                  onChange={(e) =>
                    setRestockData({ ...restockData, sweetId: e.target.value })
                  }
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", marginBottom: "0.5rem" }}
                >
                  <option value="">-- Select Product --</option>
                  {allSweets.map((sweet) => (
                    <option key={sweet._id} value={sweet._id}>
                      {sweet.name} (ID: {sweet._id.substring(0, 8)}...)
                    </option>
                  ))}
                </select>
              ) : null}
              <input
                type="text"
                value={restockData.sweetId}
                onChange={(e) =>
                  setRestockData({ ...restockData, sweetId: e.target.value })
                }
                placeholder="Or enter product ID manually"
                style={{ marginTop: allSweets.length > 0 ? "0.5rem" : "0" }}
              />
              <small style={{ display: "block", marginTop: "0.5rem", color: "#6b7280", fontSize: "0.75rem" }}>
                💡 Tip: Product IDs are shown on each product card (visible to admins)
              </small>
            </div>
            <div className="form-group">
              <label>Quantity to Add</label>
              <input
                type="number"
                value={restockData.quantity}
                onChange={(e) =>
                  setRestockData({ ...restockData, quantity: e.target.value })
                }
                required
                min="1"
                placeholder="10"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Restocking..." : "Restock"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
