import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onEdit, onDelete, onTogglePublish, loading }) {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>Loading products...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "60px 20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontSize: "18px", color: "#666", marginBottom: "8px" }}>
          No products found
        </div>
        <div style={{ fontSize: "14px", color: "#999" }}>
          Add your first product to get started
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "24px"
    }}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
        />
      ))}
    </div>
  );
}
