import { useState } from "react";

export default function RecordTable({ records, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });

  const startEdit = (record) => {
    setEditingId(record._id);
    setEditForm({ name: record.name, email: record.email, phone: record.phone });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", email: "", phone: "" });
  };

  const saveEdit = () => {
    if (!editForm.name || !editForm.email || !editForm.phone) {
      alert("All fields are required");
      return;
    }
    onUpdate(editingId, editForm);
    setEditingId(null);
    setEditForm({ name: "", email: "", phone: "" });
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa" }}>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>Name</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>Email</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>Phone</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #dee2e6" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
                No records found
              </td>
            </tr>
          ) : (
            records.map((r) => (
              <tr key={r._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                {editingId === r._id ? (
                  <>
                    <td style={{ padding: "8px" }}>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        style={{ width: "100%", padding: "4px" }}
                      />
                    </td>
                    <td style={{ padding: "8px" }}>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        style={{ width: "100%", padding: "4px" }}
                      />
                    </td>
                    <td style={{ padding: "8px" }}>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        style={{ width: "100%", padding: "4px" }}
                      />
                    </td>
                    <td style={{ padding: "8px" }}>
                      <button
                        onClick={saveEdit}
                        style={{
                          padding: "4px 8px",
                          marginRight: "5px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "3px"
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#6c757d",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "3px"
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: "12px" }}>{r.name}</td>
                    <td style={{ padding: "12px" }}>{r.email}</td>
                    <td style={{ padding: "12px" }}>{r.phone}</td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => startEdit(r)}
                        style={{
                          padding: "4px 8px",
                          marginRight: "5px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "3px"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this record?")) {
                            onDelete(r._id);
                          }
                        }}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "3px"
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
