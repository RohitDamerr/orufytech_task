import { useState } from "react";

export default function RecordForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert("All fields are required");
      return;
    }
    onAdd(form);
    setForm({ name: "", email: "", phone: "" });
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      <h3 style={{ marginBottom: "15px" }}>Add New Record</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ced4da" }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ced4da" }}
          required
        />
        <input
          type="text"
          placeholder="Phone (10 digits)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ced4da" }}
          pattern="[0-9]{10}"
          required
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
          fontSize: "16px"
        }}
      >
        Add Record
      </button>
    </form>
  );
}
