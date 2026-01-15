import { useState, useEffect, useRef } from "react";

export default function AddProductModal({ isOpen, onClose, onSubmit, initialData }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    mrp: "",
    price: "",
    brand: "",
    images: "",
    exchangeEligible: "Yes"
  });
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (initialData) {
      const images = Array.isArray(initialData.images) ? initialData.images : [];
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
        quantity: initialData.quantity || "",
        mrp: initialData.mrp || "",
        price: initialData.price || "",
        brand: initialData.brand || "",
        images: images.join(", "),
        exchangeEligible: initialData.exchangeEligible ? "Yes" : "No"
      });
      setImageUrls(images);
    } else {
      setFormData({
        name: "",
        type: "",
        quantity: "",
        mrp: "",
        price: "",
        brand: "",
        images: "",
        exchangeEligible: "Yes"
      });
      setImageUrls([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update image URLs when images input changes
    // Keep uploaded files (data URLs) and replace text URLs with what's typed
    if (name === "images") {
      const textUrls = value.split(",").map(img => img.trim()).filter(img => img);
      // Keep only data URLs (base64) from current imageUrls, add new text URLs
      const dataUrls = imageUrls.filter(url => url.startsWith("data:"));
      // Filter out old text URLs (non-data URLs) and add new ones
      const allUrls = [...dataUrls, ...textUrls];
      setImageUrls(allUrls);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Convert files to data URLs
    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(dataUrls => {
      const allUrls = [...imageUrls, ...dataUrls];
      setImageUrls(allUrls);
      setFormData(prev => ({
        ...prev,
        images: allUrls.join(", ")
      }));
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setFormData(prev => ({
      ...prev,
      images: newUrls.join(", ")
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use imageUrls as the source of truth - it contains both uploaded files and typed URLs
    // Remove duplicates while preserving order
    const finalImages = [...new Set(imageUrls)];
    
    const submitData = {
      ...formData,
      quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      mrp: formData.mrp ? parseFloat(formData.mrp) : 0,
      price: formData.price ? parseFloat(formData.price) : 0,
      images: finalImages,
      exchangeEligible: formData.exchangeEligible === "Yes"
    };
    onSubmit(submitData);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "32px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        position: "relative"
      }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ×
        </button>

        <h2 style={{
          marginBottom: "24px",
          fontSize: "24px",
          fontWeight: "700",
          color: "#1a1a1a"
        }}>
          {initialData ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Product Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#fff"
              }}
            >
              <option value="">Select product type</option>
              <option value="Food">Food</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Home & Office">Home & Office</option>
              <option value="Fitness">Fitness</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Quantity Stock
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Total numbers of Stock available"
              min="0"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              MRP
            </label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              placeholder="Total numbers of Stock available"
              min="0"
              step="0.01"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Selling Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Total numbers of Stock available"
              min="0"
              step="0.01"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Brand Name
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Total numbers of Stock available"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Upload Product Images
            </label>
            <div style={{
              display: "flex",
              gap: "8px",
              marginBottom: "12px"
            }}>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="Enter image URLs (comma-separated) or click Browse to upload"
                style={{
                  flex: "1",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px"
                }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={handleBrowseClick}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  whiteSpace: "nowrap"
                }}
              >
                Browse
              </button>
            </div>
            {imageUrls.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                gap: "8px",
                marginTop: "12px"
              }}>
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "100%",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #d1d5db"
                    }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=Error";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(220, 38, 38, 0.9)",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Exchange or return eligibility
            </label>
            <select
              name="exchangeEligible"
              value={formData.exchangeEligible}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "#fff"
              }}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px"
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
                backgroundColor: "#f3f4f6",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
