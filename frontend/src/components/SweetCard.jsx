const SweetCard = ({ sweet, onPurchase, isAdmin, onEdit, onDelete, onRestock, showLoginPrompt }) => {
  const isOutOfStock = sweet.quantity === 0;
  const emojiMap = {
    "Sweets": "🍬",
    "Chocolates": "🍫",
    "Ice Creams": "🍦",
    "Shakes": "🥤",
    "Cakes": "🎂",
    "Cookies": "🍪"
  };

  return (
    <div className={`product-card ${isOutOfStock ? "out-of-stock" : ""}`}>
      <div className="product-image">
        {sweet.image ? (
          <img 
            src={sweet.image} 
            alt={sweet.name}
            onError={(e) => {
              e.target.style.display = 'none';
              const placeholder = e.target.nextElementSibling;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="product-image-placeholder" style={{ display: sweet.image ? 'none' : 'flex' }}>
          {emojiMap[sweet.category] || "🍬"}
        </div>
      </div>
      <div className="product-body">
        <div className="product-header">
          <h3 className="product-name">{sweet.name}</h3>
          <span className="category-tag">{sweet.category}</span>
        </div>
        {isAdmin && (
          <div className="product-id" style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem", fontFamily: "monospace" }}>
            ID: {sweet._id}
          </div>
        )}
        <div className="product-price">₹{sweet.price.toFixed(2)}</div>
        <div className={`product-stock ${isOutOfStock ? "out-of-stock" : "in-stock"}`}>
          {isOutOfStock ? "❌ Out of Stock" : `✅ ${sweet.quantity} in stock`}
        </div>
        <div className="product-actions">
          <button
            onClick={() => onPurchase(sweet._id)}
            disabled={isOutOfStock}
            className="btn-add-to-cart"
          >
            {isOutOfStock ? "Out of Stock" : showLoginPrompt ? "🛒 Login to Purchase" : "🛒 Add to Cart"}
          </button>
          {isAdmin && (
            <div className="admin-actions-row">
              <button
                onClick={() => onEdit(sweet)}
                className="btn btn-success"
                title="Edit sweet"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onRestock(sweet)}
                className="btn btn-primary"
                title="Restock"
              >
                📦 Restock
              </button>
              <button
                onClick={() => onDelete(sweet._id)}
                className="btn btn-danger"
                title="Delete sweet"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
