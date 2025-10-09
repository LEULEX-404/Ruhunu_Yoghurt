import { useState, useEffect } from "react";
import axios from "axios";
import '../../Css/rawhistory.css'; // import the CSS file

export default function RawMaterialManager() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [actionType, setActionType] = useState("Add"); // Add or Remove
  const [history, setHistory] = useState([]);
  const [filterAction, setFilterAction] = useState("All"); // All, Add, Remove

  useEffect(() => {
    axios.get("http://localhost:8070/api/rawmaterials")
      .then(res => {
        const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setRawMaterials(sorted);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedId || !quantity) return;

    const material = rawMaterials.find(m => m._id === selectedId);
    if (!material) return;

    const qty = Number(quantity);

    // Check if remove exceeds available quantity
    if (actionType === "Remove" && qty > material.quantity) {
      alert("Cannot remove more than available stock!");
      return;
    }

    let newMaterials = rawMaterials.map(m =>
      m._id === selectedId
        ? { ...m, quantity: actionType === "Add" ? m.quantity + qty : m.quantity - qty }
        : m
    );

    newMaterials.sort((a, b) => a.name.localeCompare(b.name));
    setRawMaterials(newMaterials);

    // Add to history
    const newRecord = {
      id: material.MID,
      name: material.name,
      quantity: qty,
      action: actionType,
      time: new Date().toLocaleString()
    };
    setHistory([newRecord, ...history]);

    setSelectedId("");
    setQuantity("");
  };

  const handleDeleteHistory = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
  };

  const filteredHistory = history.filter(h => filterAction === "All" || h.action === filterAction);

  return (
    <div className="manager-container">
      <form onSubmit={handleSubmit} className="manager-form">
        <h2>Manage Raw Materials</h2>

        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} required>
          <option value="">Select Material</option>
          {rawMaterials.map(m => (
            <option key={m._id} value={m._id}>
              {m.name} (Qty: {m.quantity})
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
      <div className="filter-container">
        Filter:{" "}
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)}>
          <option value="All">All</option>
          <option value="Add">Add</option>
          <option value="Remove">Remove</option>
        </select>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Action</th>
            <th>Quantity</th>
            <th>Time</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory.map((h, index) => (
            <tr key={index} className={h.action.toLowerCase()}>
              <td>{h.id}</td>
              <td>{h.name}</td>
              <td>{h.action}</td>
              <td>{h.quantity}</td>
              <td>{h.time}</td>
              <td>
                <button onClick={() => handleDeleteHistory(history.indexOf(h))} className="delete-btn">
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
