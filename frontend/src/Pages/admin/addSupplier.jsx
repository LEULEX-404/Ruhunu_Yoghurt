import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import '../../Css/suplieradd.css'

export default function AddSupplierPage() {
  const [supplierId, setSupplierId] = useState("");
  const [name, setName] = useState("");
  const [materials, setMaterials] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");
  const navigate = useNavigate();

  // Validation
  function validateSupplier() {
    if (!supplierId.trim()) return "Supplier ID is required";
    if (!name.trim()) return "Supplier name is required";
    if (!materials.trim()) return "At least one material is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email format";
    if (!phone.match(/^\d{10}$/)) return "Phone number must be 10 digits";
    if (!address.trim()) return "Address is required";
    
    return null;
  }

  async function addSupplier(e) {
    e.preventDefault();
    const error = validateSupplier();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const supplier = {
        SID: supplierId,
        name,
        materials: materials
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m.length > 0),
        email,
        phone,
        address,
        schedule,
      };

      await axios.post("http://localhost:8070/api/suppliers", supplier);
      toast.success("✅ Supplier added successfully");
      navigate("/suplierTable");
    } catch (e) {
      toast.error(e.response?.data?.message || "Error adding supplier");
    }
  }

  return (
    <div className="add-form-container">
      <form onSubmit={addSupplier} className="add-form">
        <h2>Add Supplier</h2>

        <input type="text" placeholder="Supplier ID" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required />
        <input type="text" placeholder="Supplier Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Materials" value={materials} onChange={(e) => setMaterials(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        

        <div className="button-container">
          <Link to="/admin/suppliers" className="btn btn-cancel">Cancel</Link>
          <button type="submit" className="btn btn-submit">Add Supplier</button>
        </div>
      </form>
    </div>
  );
}
