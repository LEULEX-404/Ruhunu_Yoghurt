import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import '../Css/suppliertable.css'

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) fetchSuppliers();
  }, [isLoading]);

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/api/suppliers");
      console.log("📦 Suppliers from API:", res.data); 
      setSuppliers(res.data);
    } catch (err) {
      toast.error("Failed to fetch suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete supplier
  const deleteSupplier = async (id) => {
    try {
      await axios.delete(`/api/suppliers/${id}`);
      toast.success("Supplier deleted successfully");
      setIsLoading(true); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete supplier");
    }
  };

  // Navigate to edit supplier page
  const updateSupplier = (supplier) => {
    navigate("/updateSupplier/" + supplier._id, { state: supplier });
  };

  if (isLoading) return <div className="supplier-loading">Loading suppliers...</div>;

  if (suppliers.length === 0) return (
    <div className="supplier-admin-container">
      <Link to="/addSupplier" className="supplier-add-link">Add Supplier</Link>
      <div className="supplier-no-data">No suppliers to display.</div>
    </div>
  );

  return (
    <div className="supplier-admin-container">
      <Link className="supplier-add-link" to="/addSupplier">Add Supplier</Link>
      <div className="supplier-table-container">
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
                <td className="supplier-table-actions">
                  <button className="edit-btn" onClick={() => updateSupplier(s)}>
                    <FaEdit/>
                  </button>
                  <button className="delete-btn" onClick={() => deleteSupplier(s._id)}>
                    <FaTrash/>
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
