import { useState, useEffect } from "react";
import axios from "axios";
import '../../Css/RequestRawMaterialEmail.css' // Make sure to import the CSS

export default function RequestRawMaterialEmail() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([
    { materialId: "", quantity: "", unit: "kg" },
  ]);
  const [notes, setNotes] = useState("");

  // Fetch suppliers + materials
  useEffect(() => {
    async function fetchData() {
      try {
        const [suppliersRes, materialsRes] = await Promise.all([
          axios.get("http://localhost:8070/api/suppliers"),
          axios.get("http://localhost:8070/api/rawmaterials"),
        ]);
        setSuppliers(suppliersRes.data);
        setMaterials(materialsRes.data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    }
    fetchData();
  }, []);

  // Auto-fill supplier email when selected
  useEffect(() => {
    const supplier = suppliers.find((s) => s._id === selectedSupplierId);
    if (supplier) setSupplierEmail(supplier.email);
    else setSupplierEmail("");
  }, [selectedSupplierId, suppliers]);

  // Add material row
  const addMaterialRow = () => {
    setSelectedMaterials([
      ...selectedMaterials,
      { materialId: "", quantity: "", unit: "kg" },
    ]);
  };

  // Update material selection
  const handleMaterialChange = (index, field, value) => {
    const updated = [...selectedMaterials];
    updated[index][field] = value;
    setSelectedMaterials(updated);
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Build email message
      let emailText =
        "Dear Supplier,\n\nWe would like to request the following raw materials:\n";
      selectedMaterials.forEach((m) => {
        const matName =
          materials.find((mat) => mat._id === m.materialId)?.name || "";
        emailText += `- ${matName}: ${m.quantity} ${m.unit}\n`;
      });
      if (notes) emailText += `\nNotes: ${notes}\n`;
      emailText += "\nPlease deliver at your earliest convenience.\n\nThank you!";

      // 1️⃣ Send Email
      await axios.post("http://localhost:8070/api/raw-material/email", {
        supplierEmail,
        subject: "Raw Material Request",
        message: emailText,
      });

      // 2️⃣ Save Requests in DB
      for (let m of selectedMaterials) {
        await axios.post("http://localhost:8070/api/raw-material/requests", {
          supplierId: selectedSupplierId,
          materialId: m.materialId,
          quantity: m.quantity,
          unit: m.unit,
        });
      }

      alert("✅ Request sent and saved successfully!");
      setSelectedMaterials([{ materialId: "", quantity: "", unit: "kg" }]);
      setNotes("");
    } catch (err) {
      console.error("❌ Request error:", err.response?.data || err.message);
      alert("Failed to send or save request. Check console for details.");
    }
  };

  return (
    <div className="rm-email-container">
      <h2 className="rm-email-title">Request Raw Materials </h2>
      <form onSubmit={handleSubmit} className="rm-email-form">
        {/* Supplier */}
        <select
          value={selectedSupplierId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
          required
          className="rm-select"
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Email */}
        <input
          type="email"
          value={supplierEmail}
          readOnly
          placeholder="Supplier Email"
          className="rm-input"
        />

        {/* Materials */}
        {selectedMaterials.map((m, idx) => (
          <div key={idx} className="rm-material-row">
            <select
              value={m.materialId}
              onChange={(e) =>
                handleMaterialChange(idx, "materialId", e.target.value)
              }
              required
              className="rm-select"
            >
              <option value="">Select Material</option>
              {materials.map((mat) => (
                <option key={mat._id} value={mat._id}>
                  {mat.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={m.quantity}
              onChange={(e) =>
                handleMaterialChange(idx, "quantity", e.target.value)
              }
              required
              className="rm-input rm-quantity"
            />

            <select
              value={m.unit}
              onChange={(e) =>
                handleMaterialChange(idx, "unit", e.target.value)
              }
              className="rm-select"
            >
              <option value="kg">kg</option>
              <option value="L">L</option>
              <option value="pcs">pcs</option>
            </select>
          </div>
        ))}

        
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rm-textarea"
        />

        <button type="submit" className="rm-submit-btn">
          Send Request
        </button>
      </form>
    </div>
  );
}
