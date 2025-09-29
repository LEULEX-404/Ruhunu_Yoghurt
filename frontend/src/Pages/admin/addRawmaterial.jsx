import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import '../../Css/Rawmaterialadd.css'

export default function AddRawMaterialPage() {
  const [MID, setMID] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("kg");
  const [quantity, setQuantity] = useState(0);
  const [supplier, setSupplier] = useState("");  
  const [isAvailable, setIsAvailable] = useState(true);
  const [suppliers, setSuppliers] = useState([]); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:8070/api/suppliers");
        setSuppliers(res.data);
      } catch (err) {
        toast.error("Failed to load suppliers");
      }
    };
    fetchSuppliers();
  }, []);

  // Validation
  function validateRawMaterial() {
    if (!MID.trim()) return "Material ID is required";
    if (!name.trim()) return "Material Name is required";
    if (isNaN(quantity) || quantity <= 0) return "Quantity must be a positive number";
    if (!supplier.trim()) return "Supplier is required";
    return null;
  }

  async function addRawMaterial(e) {
    e.preventDefault();
    const error = validateRawMaterial();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const rawMaterial = {
        MID,
        name,
        unit,
        quantity,
        supplier,  
        isAvailable,
      };

      await axios.post("http://localhost:8070/api/rawmaterials", rawMaterial);
      toast.success("Raw Material added successfully");
      navigate("/RawMaterialTable");
    } catch (e) {
      toast.error(e.response?.data?.message || "Error adding raw material");
    }
  }

  return (
    <div className="add-form-container">
      <form onSubmit={addRawMaterial} className="add-form">
        <h2>Add Stock</h2>
        
        <input type="text" placeholder="Material ID" value={MID} onChange={(e) => setMID(e.target.value)} required />
        <input type="text" placeholder="Material Name" value={name} onChange={(e) => setName(e.target.value)} required />
        
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="l">l</option>
          <option value="ml">ml</option>
          <option value="pcs">pcs</option>
        </select>

        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />

        
        <select value={supplier} onChange={(e) => setSupplier(e.target.value)} required>
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s.name}>
              {s.name} ({s.SID})
            </option>
          ))}
        </select>

        <select value={isAvailable} onChange={(e) => setIsAvailable(e.target.value === "true")}>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        <div className="button-container">
          <Link to="/admin/rawmaterials" className="btn btn-cancel">Cancel</Link>
          <button type="submit" className="btn btn-submit">Add Raw Material</button>
        </div>
      </form>
    </div>
  );
}
