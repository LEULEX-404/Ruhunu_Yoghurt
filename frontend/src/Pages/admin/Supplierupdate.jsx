import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function UpdateSupplierPage() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSupplier() {
      try {
        const res = await axios.get(`http://localhost:8070/api/suppliers/${id}`);
        setSupplier(res.data);
      } catch (e) {
        toast.error("❌ Failed to load supplier data");
      } finally {
        setLoading(false);
      }
    }
    fetchSupplier();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    // Prevent editing the ID
    if (name === "SID") return;
    setSupplier({ ...supplier, [name]: value });
  }

  // Validation function
  function validateSupplier() {
    if (!supplier?.SID?.trim()) return "Supplier ID is required";
    if (!supplier?.name?.trim()) return "Name is required";
    if (!supplier?.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return "Invalid email format";
    if (!supplier?.phone?.match(/^\d{10}$/))
      return "Phone must be 10 digits";
    if (!supplier?.address?.trim()) return "Address is required";
    return null;
  }

  async function updateSupplier(e) {
    e.preventDefault();
    const error = validateSupplier();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await axios.put(`http://localhost:8070/api/suppliers/${id}`, supplier);
      toast.success("✅ Supplier updated successfully!");
      navigate("/suplierTable");
    } catch (e) {
      toast.error(e.response?.data?.message || "Error updating supplier");
    }
  }

  if (loading) return <p>⏳ Loading supplier data...</p>;
  if (!supplier) {
    return (
      <div className="loading-message">
        <h3>❌ Supplier not found</h3>
        <Link to="/admin/suppliers" className="btn btn-cancel">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="add-form-container">
      <form onSubmit={updateSupplier} className="add-form">
        <h2>Update Supplier</h2>

        {/* Read-only Supplier ID */}
        <input type="text" name="SID" value={supplier.SID} readOnly />

        <input
          type="text"
          name="name"
          value={supplier.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={supplier.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          value={supplier.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          value={supplier.address}
          onChange={handleChange}
          required
        />

        <div className="button-container">
          <Link to="/admin/suppliers" className="btn btn-cancel">Cancel</Link>
          <button type="submit" className="btn btn-submit">Update Supplier</button>
        </div>
      </form>
    </div>
  );
}
