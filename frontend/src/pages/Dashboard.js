import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import RecordForm from "../components/RecordForm";
import RecordTable from "../components/RecordTable";
import SearchBar from "../components/SearchBar";

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async (search = "") => {
    try {
      setError("");
      const res = await api.get(`/records?search=${search}`);
      setRecords(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to load records");
      }
    }
  };

  const handleAdd = async (data) => {
    try {
      setError("");
      await api.post("/records", data);
      load();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to add record");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await api.delete(`/records/${id}`);
      load();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to delete record");
      }
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      setError("");
      await api.put(`/records/${id}`, data);
      load();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to update record");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Logout
        </button>
      </div>
      {error && (
        <div style={{ color: "red", marginBottom: "15px", padding: "10px", backgroundColor: "#ffe6e6", borderRadius: "4px" }}>
          {error}
        </div>
      )}
      <div style={{ marginBottom: "20px" }}>
        <SearchBar onSearch={load} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <RecordForm onAdd={handleAdd} />
      </div>
      <RecordTable
        records={records}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
