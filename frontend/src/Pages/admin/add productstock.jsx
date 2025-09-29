import { useState, useEffect } from "react";
import axios from "axios";

export default function AddRemoveProductForm() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [actionType, setActionType] = useState("Add");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8070/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || !quantity) return;

    const product = products.find(p => p._id === selectedId); 
    if (!product) return;

    const qty = Number(quantity);

    if (actionType === "Remove" && qty > product.quantity) {
      alert("Cannot remove more than available stock!");
      return;
    }

    const apiAction = actionType === "Add" ? "increase" : "decrease";

    try {
        const res = await axios.put(
          `http://localhost:8070/api/products/${selectedId}/${apiAction}`,
          {amount: qty}  // ✅ match controller
        );

      setProducts(products.map(p =>
        p._id === selectedId ? res.data : p
      ));

      const newRecord = {
        id: product._id,
        name: product.name,
        quantity: qty,
        action: actionType,
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

  return (
    <div className="manager-container">
      <form onSubmit={handleSubmit} className="manager-form">
        <h2>Manage Product Stock</h2>

        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} required>
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} (Qty: {p.quantity})
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
