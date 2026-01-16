import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createProduct, updateProduct, deleteProduct, togglePublishProduct } from "../api/productApi";
import AddProductModal from "../components/AddProductModal";
import ProductGrid from "../components/ProductGrid";

export default function Dashboard() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Published");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const loadProducts = useCallback(async (search = "", tab = "Published") => {
    try {
      setLoading(true);
      setError("");
      const published = tab === "Published";
      const data = await getProducts(search, published);
      setFilteredProducts(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to load products. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleAdd = async (productData) => {
    try {
      setError("");
      await createProduct(productData);
      setIsModalOpen(false);
      setSuccessMessage("Product added Successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      // New products are unpublished by default, so switch to Unpublished tab to show the new product
      setActiveTab("Unpublished");
      loadProducts(searchTerm, "Unpublished");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to add product. Please try again.");
      }
    }
  };

  const handleUpdate = async (productData) => {
    try {
      setError("");
      await updateProduct(editingProduct._id, productData);
      setIsModalOpen(false);
      setEditingProduct(null);
      setSuccessMessage("Product updated Successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      loadProducts(searchTerm, activeTab);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to update product. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteProduct(id);
      setSuccessMessage("Product Deleted Successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      loadProducts(searchTerm, activeTab);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      setError("");
      await togglePublishProduct(id);
      loadProducts(searchTerm, activeTab);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to toggle publish status. Please try again.");
      }
    }
  };

  const handleSearch = (search) => {
    setSearchTerm(search);
    loadProducts(search, activeTab);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    loadProducts(searchTerm, tab);
  };

  const handleHomeClick = () => {
    // Reset to show all published products
    setActiveTab("Published");
    setSearchTerm("");
    loadProducts("", "Published");
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    loadProducts("", activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f9fafb"
    }}>
      {/* Sidebar */}
      <aside style={{
        width: "280px",
        backgroundColor: "#374151",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "24px"
      }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "32px"
        }}>
          <span style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#fff"
          }}>Productr</span>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#ff6b35"
          }}></div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "32px" }}>
          <input
            type="text"
            placeholder="Q Search"
            style={{
              width: "100%",
              padding: "10px 12px",
              backgroundColor: "#4b5563",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Navigation */}
        <nav style={{ flex: "1" }}>
          <div 
            onClick={handleHomeClick}
            style={{
              marginBottom: "8px",
              padding: "12px",
              borderRadius: "6px",
              cursor: "pointer",
              color: "#d1d5db",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#4b5563";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#d1d5db";
            }}
          >
            Home
          </div>
          <div style={{
            marginBottom: "8px",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: "#4b5563",
            cursor: "pointer",
            color: "#fff",
            fontWeight: "500"
          }}>
            Products 🔒
          </div>
        </nav>

        {/* Logout Button */}
        <div style={{
          marginTop: "auto",
          paddingTop: "24px",
          borderTop: "1px solid #4b5563"
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#b91c1c";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#dc2626";
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginTop: "auto",
          paddingTop: "24px"
        }}>
          <button
            onClick={() => handleTabChange("Published")}
            style={{
              flex: "1",
              padding: "10px",
              backgroundColor: activeTab === "Published" ? "#3b82f6" : "#4b5563",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            Published
          </button>
          <button
            onClick={() => handleTabChange("Unpublished")}
            style={{
              flex: "1",
              padding: "10px",
              backgroundColor: activeTab === "Unpublished" ? "#3b82f6" : "#4b5563",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            Unpublished
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: "1",
        padding: "32px",
        overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px"
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1a1a1a",
            margin: 0
          }}>
            Products
          </h1>
          <div style={{
            display: "flex",
            gap: "16px",
            alignItems: "center"
          }}>
            <input
              type="text"
              placeholder="Q Search Services, Products"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                padding: "10px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                width: "300px"
              }}
            />
            <button
              onClick={handleOpenModal}
              style={{
                padding: "12px 24px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              + Add Products
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: "24px",
            padding: "16px",
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            borderRadius: "8px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "16px 24px",
            backgroundColor: "#10b981",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 1001,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}>
            <span>✓</span>
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "18px",
                marginLeft: "8px"
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "18px", color: "#666" }}>Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px",
            backgroundColor: "#fff",
            borderRadius: "12px"
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "16px"
            }}>📦</div>
            <div style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "8px"
            }}>
              No {activeTab} Products
            </div>
            <div style={{
              fontSize: "14px",
              color: "#6b7280"
            }}>
              Your {activeTab} Products will appear here<br />
              Create your first product to publish
            </div>
          </div>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
            loading={false}
          />
        )}

        {/* Add/Edit Product Modal */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingProduct ? handleUpdate : handleAdd}
          initialData={editingProduct}
        />
      </main>
    </div>
  );
}
