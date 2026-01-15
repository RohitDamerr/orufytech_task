export default function ProductCard({ product, onEdit, onDelete, onTogglePublish }) {
  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.2s, box-shadow 0.2s"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    }}
    >
      {/* Product Image */}
      {product.images && product.images.length > 0 && (
        <div style={{
          width: "100%",
          height: "220px",
          marginBottom: "16px",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#f3f4f6"
        }}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x220?text=No+Image";
            }}
          />
        </div>
      )}

      {/* Product Name */}
      <h3 style={{
        margin: "0 0 16px 0",
        fontSize: "18px",
        fontWeight: "600",
        color: "#1a1a1a"
      }}>
        {product.name}
      </h3>

      {/* Product Details */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "20px",
        fontSize: "14px",
        color: "#374151"
      }}>
        {product.type && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#6b7280" }}>Product type:</span>
            <span style={{ fontWeight: "500" }}>{product.type}</span>
          </div>
        )}
        {product.quantity !== undefined && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#6b7280" }}>Quantity Stock:</span>
            <span style={{ fontWeight: "500" }}>{product.quantity}</span>
          </div>
        )}
        {product.mrp > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#6b7280" }}>MRP:</span>
            <span style={{ fontWeight: "500" }}>₹{product.mrp}</span>
          </div>
        )}
        {product.price > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#6b7280" }}>Selling Price:</span>
            <span style={{ fontWeight: "500" }}>₹{product.price}</span>
          </div>
        )}
        {product.brand && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#6b7280" }}>Brand Name:</span>
            <span style={{ fontWeight: "500" }}>{product.brand}</span>
          </div>
        )}
        {product.images && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#6b7280" }}>Total Number of images:</span>
            <span style={{ fontWeight: "500" }}>{product.images.length}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#6b7280" }}>Exchange Eligibility:</span>
          <span style={{ fontWeight: "500" }}>{product.exchangeEligible ? "YES" : "NO"}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: "flex",
        gap: "8px"
      }}>
        <button
          onClick={() => onTogglePublish(product._id)}
          style={{
            flex: "1",
            padding: "10px 16px",
            backgroundColor: product.published ? "#10b981" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          {product.published ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => onEdit(product)}
          style={{
            padding: "10px 16px",
            backgroundColor: "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this product?")) {
              onDelete(product._id);
            }
          }}
          style={{
            padding: "10px 16px",
            backgroundColor: "#9ca3af",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
