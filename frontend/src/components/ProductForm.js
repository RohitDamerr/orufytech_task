import { useState, useEffect } from "react";

export default function ProductForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    mrp: "",
    price: "",
    brand: "",
    images: "",
    exchangeEligible: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
        quantity: initialData.quantity || "",
        mrp: initialData.mrp || "",
        price: initialData.price || "",
        brand: initialData.brand || "",
        images: Array.isArray(initialData.images) ? initialData.images.join(", ") : "",
        exchangeEligible: initialData.exchangeEligible || false
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      mrp: formData.mrp ? parseFloat(formData.mrp) : 0,
      price: formData.price ? parseFloat(formData.price) : 0,
      images: formData.images ? formData.images.split(",").map(img => img.trim()).filter(img => img) : []
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: "#fff",
      padding: "24px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      marginBottom: "24px"
    }}>
      <h3 style={{ marginBottom: "20px", color: "#333" }}>
        {initialData ? "Edit Product" : "Add New Product"}
      </h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "16px",
        marginBottom: "20px"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#555" }}>
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#555" }}>
            Type
          </label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#555" }}>
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#555" }}>
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#555" }}>
            MRP (₹)
          </label>
          <input
            type="number"
            name="mrp"
            value={formData.mrp}
            onChange={handleChange}
            min="0"
            step="0.01"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#555" }}>
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500", color: "#555" }}>
            Image URLs (comma-separated)
          </label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            name="exchangeEligible"
            checked={formData.exchangeEligible}
            onChange={handleChange}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <label style={{ fontSize: "14px", color: "#555", cursor: "pointer" }}>
            Exchange Eligible
          </label>
        </div>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="submit"
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          {initialData ? "Update Product" : "Add Product"}
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "12px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
