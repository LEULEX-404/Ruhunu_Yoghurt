import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import StockLayout from "../../src/Pages/Stocklayout.jsx";
import "../Css/rawdetails.css";

export default function RawMaterialTable() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");

  const navigate = useNavigate();

  const fetchMaterials = async () => {
    try {
      const res = await axios.get("/api/rawmaterials");
      setMaterials(res.data);
      setFilteredMaterials(res.data);
      res.data.forEach((m) => {
        if (m.quantity < 100) toast.error(`⚠️ Low stock: ${m.name}`);
      });
    } catch (err) {
      setError("Failed to fetch raw materials");
      toast.error("Failed to fetch raw materials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = materials;

    // Low stock filter
    if (filter === "low") {
      filtered = filtered.filter((m) => m.quantity < 100);
    } else if (filter === "available") {
      filtered = filtered.filter((m) => m.isAvailable === true);
    }

    // Unit filter
    if (unitFilter !== "all") {
      filtered = filtered.filter((m) => m.unit === unitFilter);
    }

    setFilteredMaterials(filtered);
  }, [filter, unitFilter, materials]);

  const deleteMaterial = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/rawmaterials/${id}`);
      toast.success("Deleted successfully");
      fetchMaterials();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const updateMaterial = (m) => {
    navigate(`/updateRawmaterial/${m._id}`, { state: m });
  };

  
  const unitOptions = ["all", ...new Set(materials.map((m) => m.unit))];

  return (
    <StockLayout
      title="📦 Raw Materials"
      subtitle="Manage and monitor stock levels"
      active="materials"
    >
      {isLoading ? (
        <div className="rawmaterial-loading">Loading...</div>
      ) : error ? (
        <div className="rawmaterial-no-data">{error}</div>
      ) : materials.length === 0 ? (
        <div className="rawmaterial-no-data">No raw materials found.</div>
      ) : (
        <div className="rawmaterial-admin-container">
          {/* ➕ Add New */}
          <div className="rawmaterial-header-controls">
            <Link className="rawmaterial-add-link" to="/addRawmaterial">
              ➕ Add Raw Material
            </Link>

            {/*  Filter Controls */}
            <div className="rawmaterial-filters">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rawmaterial-filter-select"
              >
                <option value="all">All</option>
                <option value="low">Low Stock (Qty &lt; 100)</option>
                <option value="available">Available Only</option>
              </select>

              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="rawmaterial-filter-select"
              >
                {unitOptions.map((unit, i) => (
                  <option key={i} value={unit}>
                    {unit === "all" ? "All Units" : unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="rawmaterial-table-container">
            <table className="rawmaterial-table">
              <thead>
                <tr>
                  <th>MID</th>
                  <th>Name</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Supplier</th>
                  <th>Updated</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((m) => (
                  <tr key={m._id}>
                    <td>{m.MID}</td>
                    <td>{m.name}</td>
                    <td>{m.unit}</td>
                    <td
                      className={
                        m.quantity < 100 ? "rawmaterial-low" : "rawmaterial-normal"
                      }
                    >
                      {m.quantity}
                    </td>
                    <td>{m.supplier}</td>
                    <td>{new Date(m.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`rawmaterial-availability ${
                          m.isAvailable ? "yes" : "no"
                        }`}
                      >
                        {m.isAvailable ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => updateMaterial(m)}
                        className="edit-btn"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteMaterial(m._id)}
                        className="delete-btn"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </StockLayout>
  );
}
