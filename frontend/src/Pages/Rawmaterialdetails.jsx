import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import '../Css/rawdetails.css'

export default function RawMaterialTable() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all raw materials
  const fetchMaterials = async () => {
    try {
      const res = await axios.get("/api/rawmaterials");
      setMaterials(res.data);
      setError(null);

      // Check for low quantity and show popup
      res.data.forEach((material) => {
        if (material.quantity < 100) {
          toast.error(
            `Warning: Quantity of ${material.name} is below 100!`,
            { duration: 3000 }
          );
        }
      });

    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch raw materials");
      toast.error(err.response?.data?.message || "Failed to fetch raw materials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Delete raw material
  const deleteMaterial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await axios.delete(`/api/rawmaterials/${id}`);
      toast.success("Raw material deleted successfully");
      fetchMaterials();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete raw material");
    }
  };

  // Navigate to update page
  const updateMaterial = (material) => {
    navigate("/updateRawmaterial/" + material._id, { state: material });
  };

  if (isLoading) return <div className="rawmaterial-loading">Loading raw materials...</div>;
  if (error) return <div className="rawmaterial-no-data">{error}</div>;
  if (materials.length === 0)
    return (
      <div className="rawmaterial-admin-container">
        <Link className="rawmaterial-add-link" to="/addRawmaterial">
          Add Raw Material
        </Link>
        <div className="rawmaterial-no-data">No raw materials to display.</div>
      </div>
    );

  return (
    <div className="rawmaterial-admin-container">
      <Link className="rawmaterial-add-link" to="/addRawmaterial">
        Add Raw Material
      </Link>
      <div className="rawmaterial-table-container">
        <table className="rawmaterial-table">
          <thead>
            <tr>
              <th>MID</th>
              <th>Name</th>
              <th>Unit</th>
              <th>Current Stock</th>
              <th>Supplier</th>
              <th>Updated At</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m._id}>
                <td>{m.MID}</td>
                <td>{m.name}</td>
                <td>{m.unit}</td>
                <td>
                  <span className="rawmaterial-quantity">{m.quantity}</span>
                </td>
                <td>{m.supplier}</td>
                <td>{new Date(m.updatedAt).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`rawmaterial-availability ${m.isAvailable ? "yes" : "no"}`}
                  >
                    {m.isAvailable ? "Yes" : "No"}
                  </span>
                </td>
                <td className="rawmaterial-table-actions">
                  <button className="edit-btn" onClick={() => updateMaterial(m)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => deleteMaterial(m._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
