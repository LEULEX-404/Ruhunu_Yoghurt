import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function UpdateRawMaterialPage() {
  const { id } = useParams();
  const [rawMaterial, setRawMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRawMaterial() {
      try {
        const res = await axios.get(`http://localhost:8070/api/rawmaterials/${id}`);
        setRawMaterial(res.data);
      } catch (e) {
        toast.error("❌ Failed to load raw material data");
      } finally {
        setLoading(false);
      }
    }
    fetchRawMaterial();
  }, [id]);

  function handleChange(e) {
    setRawMaterial({ ...rawMaterial, [e.target.name]: e.target.value });
  }

  //Validation function
  function validateRawMaterial() {
    if (!rawMaterial.name.trim()) return "Material name is required";
    if (!rawMaterial.unit.trim()) return "Unit is required";
    if (isNaN(rawMaterial.quantity) || rawMaterial.quantity <= 0)
      return "Quantity must be a positive number";
    if (!rawMaterial.supplier.trim()) return "Supplier name is required";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const error = validateRawMaterial();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await axios.put(`http://localhost:8070/api/rawmaterials/${id}`, rawMaterial);
      toast.success("✅ Raw Material updated successfully!");
      navigate("/rawmaterialTable");
    } catch (e) {
      toast.error(e.response?.data?.message || "Error updating raw material");
    }
  }

  if (loading) return <p>⏳ Loading raw material data...</p>;
  if (!rawMaterial) {
    return (
      <div className="loading-message">
        <h3>❌ Raw Material not found</h3>
        <Link to="/admin/rawmaterials" className="btn btn-cancel">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="add-form-container">
      <form onSubmit={handleSubmit} className="add-form">
        <h2>Update Raw Material</h2>

        <input type="text" name="name" value={rawMaterial.name} onChange={handleChange} required />
        <input type="text" name="unit" value={rawMaterial.unit} onChange={handleChange} required />
        <input type="number" name="quantity" value={rawMaterial.quantity} onChange={handleChange} required />
        <input type="text" name="supplier" value={rawMaterial.supplier} onChange={handleChange} required />

        <div className="button-container">
          <Link to="/admin/rawmaterials" className="btn btn-cancel">Cancel</Link>
          <button type="submit" className="btn btn-submit">Update Raw Material</button>
        </div>
      </form>
    </div>
  );
}
