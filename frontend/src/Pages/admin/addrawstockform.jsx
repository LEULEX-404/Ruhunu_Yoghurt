import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import StockLayout from "../../Pages/Stocklayout.jsx";
import '../../Css/addrawstockform.css';

export default function RawMaterialTable() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState({});

  const fetchMaterials = async () => {
    try {
      const res = await axios.get("/api/rawmaterials");
      setMaterials(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load materials");
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAction = async (id, action) => {
    if (!quantity[id] || isNaN(quantity[id])) {
      toast.error("Enter valid quantity");
      return;
    }

    try {
      const endpoint =
        action === "Add"
          ? `/api/rawmaterials/increase/${id}`
          : `/api/rawmaterials/decrease/${id}`;

      await axios.put(endpoint, { quantity: quantity[id] });
      toast.success(`${action}ed ${quantity[id]} successfully`);
      setQuantity({ ...quantity, [id]: "" });
      fetchMaterials();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <p className="raw-loading">Loading...</p>;

  return (
    <StockLayout title="📦 Raw Material Stock" subtitle="Manage stock levels" active="materials">
      <div className="raw-table-container">
        <table className="raw-table">
          <thead>
            <tr>
              <th>MID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No materials found</td>
              </tr>
            ) : (
              materials.map((m) => (
                <tr key={m._id}>
                  <td>{m.MID}</td>
                  <td>{m.name}</td>
                  <td>{m.quantity}</td>
                  <td className="raw-actions">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={quantity[m._id] || ""}
                      onChange={(e) =>
                        setQuantity({ ...quantity, [m._id]: e.target.value })
                      }
                    />
                    <button
                      onClick={() => handleAction(m._id, "Add")}
                      className="raw-btn-add"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleAction(m._id, "Remove")}
                      className="raw-btn-remove"
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </StockLayout>
  );
}
