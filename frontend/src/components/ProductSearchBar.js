import { useState } from "react";

export default function ProductSearchBar({ onSearch, onFilterChange }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "published", "unpublished"

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    onFilterChange(value);
  };

  return (
    <div style={{
      display: "flex",
      gap: "16px",
      marginBottom: "24px",
      flexWrap: "wrap"
    }}>
      <div style={{ flex: "1", minWidth: "250px" }}>
        <input
          type="text"
          placeholder="Search products by name, brand, or type..."
          value={search}
          onChange={handleSearchChange}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        />
      </div>
      <div>
        <select
          value={filter}
          onChange={handleFilterChange}
          style={{
            padding: "12px 16px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
            backgroundColor: "#fff",
            cursor: "pointer"
          }}
        >
          <option value="all">All Products</option>
          <option value="published">Published Only</option>
          <option value="unpublished">Unpublished Only</option>
        </select>
      </div>
    </div>
  );
}
