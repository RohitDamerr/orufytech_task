import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  return (
    <input
      placeholder="Search by name or email"
      value={search}
      onChange={handleSearch}
    />
  );
}
