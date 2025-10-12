import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import '../../Css/addrawstock.css';

export default function RawMaterialManager() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [actionType, setActionType] = useState("Add"); // Add or Remove
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8070/api/rawmaterials")
      .then(res => setRawMaterials(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || !quantity) return;

    const material = rawMaterials.find(m => m._id === selectedId);
    if (!material) return;

    const qty = Number(quantity);

    if (actionType === "Remove" && qty > material.quantity) {
      alert("Cannot remove more than available stock!");
      return;
    }

    //Map actionType to backend route
    const apiAction = actionType === "Add" ? "increase" : "decrease";

    try {
      const res = await axios.put(
        `http://localhost:8070/api/rawmaterials/${selectedId}/${apiAction}`,
        { quantity: qty }
      );

      // Update local state
      setRawMaterials(rawMaterials.map(m => 
        m._id === selectedId ? res.data.rawMaterial || res.data : m
      ));

      // Add to history with MID instead of _id
      const newRecord = {
        id: material.MID, 
        name: material.name,
        action: actionType,
        quantity: qty,
        time: new Date().toLocaleString()
      };
      setHistory([newRecord, ...history]);

      setSelectedId("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  const handleDeleteHistory = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
  };

  // Export history table to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text("Raw Material History Report", 14, 15);

    doc.autoTable({
      startY: 25,
      head: [["MID", "Name", "Action", "Quantity", "Time"]],
      body: history.map(h => [h.id, h.name, h.action, h.quantity, h.time]),
    });

    doc.save("history_report.pdf");
  };

  return (
    <div className="manager-container">
      <form onSubmit={handleSubmit} className="manager-form">
        <h2>Manage Raw Material Stock</h2>

        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} required>
          <option value="">Select Raw Material</option>
          {rawMaterials.map(rm => (
            <option key={rm._id} value={rm._id}>
              {rm.name} (Qty: {rm.quantity})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          required
        />

        <select value={actionType} onChange={e => setActionType(e.target.value)}>
          <option value="Add">Add</option>
          <option value="Remove">Remove</option>
        </select>

        <button type="submit" className={`action-btn ${actionType.toLowerCase()}`}>
          {actionType} Quantity
        </button>
      </form>

      <h3>History Table</h3>
      <button onClick={handleExportPDF} className="export-btn">
        📄 Export PDF
      </button>

      <table className="history-table">
        <thead>
          <tr>
            <th>MID</th>
            <th>Name</th>
            <th>Action</th>
            <th>Quantity</th>
            <th>Time</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, index) => (
            <tr key={index} className={h.action.toLowerCase()}>
              <td>{h.id}</td>
              <td>{h.name}</td>
              <td>{h.action}</td>
              <td>{h.quantity}</td>
              <td>{h.time}</td>
              <td>
                <button onClick={() => handleDeleteHistory(index)} className="delete-btn">
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
