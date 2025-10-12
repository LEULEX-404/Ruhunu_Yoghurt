import { useState, useEffect } from "react";
import axios from "axios";

export default function RequestRawMaterialEmail() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([{ materialId: "", quantity: "", unit: "kg" }]);
  const [notes, setNotes] = useState("");

  // Fetch suppliers on mount
  useEffect(() => {
    async function fetchSuppliers() {
      const res = await axios.get("http://localhost:8070/api/suppliers");
      setSuppliers(res.data);
    }
    fetchSuppliers();
  }, []);

  // When supplier changes, auto-fill email and available materials
  useEffect(() => {
    if (!selectedSupplierId) return;
    const supplier = suppliers.find(s => s._id === selectedSupplierId);
    if (supplier) {
      setSupplierEmail(supplier.email);
      setMaterials(supplier.materials); // array of material IDs/names
      setSelectedMaterials([{ materialId: supplier.materials[0] || "", quantity: "", unit: "kg" }]);
    }
  }, [selectedSupplierId, suppliers]);

  // Add more materials to request
  const addMaterialRow = () => {
    setSelectedMaterials([...selectedMaterials, { materialId: "", quantity: "", unit: "kg" }]);
  };

  const handleMaterialChange = (index, field, value) => {
    const updated = [...selectedMaterials];
    updated[index][field] = value;
    setSelectedMaterials(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare email content
    let emailText = "Dear Supplier,\n\nWe would like to request the following raw materials:\n";
    selectedMaterials.forEach((m, i) => {
      const matName = materials.find(mat => mat._id === m.materialId)?.name || "";
      emailText += `- ${matName}: ${m.quantity} ${m.unit}\n`;
    });
    if (notes) emailText += `\nNotes: ${notes}\n`;
    emailText += "\nPlease deliver at your earliest convenience.\n\nThank you!";

    // 1️⃣ Send Email via backend
    await axios.post("http://localhost:8070/api/send-email-request", {
      supplierEmail,
      message: emailText,
      subject: "Raw Material Request",
    });

    // 2️⃣ Save requests in DB
    for (let m of selectedMaterials) {
      await axios.post("http://localhost:8070/api/create-request", {
        supplierId: selectedSupplierId,
        materialId: m.materialId,
        quantity: m.quantity,
        unit: m.unit,
      });
    }

    alert("✅ Request sent and saved successfully!");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Request Raw Materials via Email</h2>
      <form onSubmit={handleSubmit}>
        {/* Supplier Selection */}
        <select value={selectedSupplierId} onChange={(e) => setSelectedSupplierId(e.target.value)} required>
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        {/* Email (auto-filled) */}
        <input type="email" value={supplierEmail} readOnly placeholder="Supplier Email" />

        {/* Materials Table */}
        {selectedMaterials.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <select
              value={m.materialId}
              onChange={(e) => handleMaterialChange(idx, "materialId", e.target.value)}
              required
            >
              <option value="">Select Material</option>
              {materials.map(mat => (
                <option key={mat._id} value={mat._id}>{mat.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={m.quantity}
              onChange={(e) => handleMaterialChange(idx, "quantity", e.target.value)}
              required
            />
            <select value={m.unit} onChange={(e) => handleMaterialChange(idx, "unit", e.target.value)}>
              <option value="kg">kg</option>
              <option value="L">L</option>
              <option value="pcs">pcs</option>
            </select>
          </div>
        ))}

        <button type="button" onClick={addMaterialRow}>+ Add Material</button>
        <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit" style={{ marginTop: 10 }}>Send Request</button>
      </form>
    </div>
  );
}
