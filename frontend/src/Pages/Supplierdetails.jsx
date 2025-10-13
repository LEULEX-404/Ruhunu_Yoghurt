import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import StockLayout from "../../src/Pages/Stocklayout.jsx";
import "../Css/suppliertable.css";

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/api/suppliers");
      setSuppliers(res.data);
    } catch {
      toast.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm("Delete supplier?")) return;
    try {
      await axios.delete(`/api/suppliers/${id}`);
      toast.success("Supplier deleted");
      fetchSuppliers();
    } catch {
      toast.error("Error deleting supplier");
    }
  };

  const updateSupplier = (s) => {
    navigate(`/updateSupplier/${s._id}`, { state: s });
  };

  return (
    <StockLayout title="🧾 Suppliers" subtitle="Manage supplier details" active="suppliers">
      {loading ? (
        <div>Loading...</div>
      ) : suppliers.length === 0 ? (
        <div>No suppliers available.</div>
      ) : (
        <div className="supplier-admin-container">
          <Link to="/addSupplier" className="supplier-add-link">Add Supplier</Link>
          <table className="supplier-table">
            <thead>
              <tr>
                <th>SID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Materials</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s._id}>
                  <td>{s.SID}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.materials.join(", ")}</td>
                  <td>{s.address}</td>
                  <td>{s.phone}</td>
                  <td>
                    <button onClick={() => updateSupplier(s)} className="edit-btn"><FaEdit /></button>
                    <button onClick={() => deleteSupplier(s._id)} className="delete-btn"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StockLayout>
  );
}
