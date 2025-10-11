import { useEffect, useState } from "react";
import '../../src/Css/RawMaterialRequestTable.css'; // Import CSS for styling

export default function RawMaterialRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8070/api/raw-material/requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:8070/api/raw-material/requests/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) fetchRequests();
      else alert(data.error || "Failed to update status");
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm("Mark this request as delivered?")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:8070/api/raw-material/requests/${id}/close`, { method: "PUT" });
      const data = await res.json();
      if (res.ok) fetchRequests();
      else alert(data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="rm-loading">Loading requests...</p>;

  return (
    <div className="rm-table-container">
      <h2 className="rm-table-title">📦 Raw Material Requests</h2>
      <div className="rm-table-wrapper">
        <table className="rm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier</th>
              <th>Material</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" className="rm-no-data">No requests found</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.requestId}</td>
                  <td>{req.supplierId?.name || "N/A"}</td>
                  <td>{req.materialId?.name || "N/A"}</td>
                  <td>{req.quantity}</td>
                  <td>{req.unit}</td>
                  <td className="rm-status-text">{req.status}</td>
                  <td>{new Date(req.requestedAt).toLocaleString()}</td>
                  <td className="rm-actions">
                    {req.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(req._id, "Approved")}
                          disabled={updatingId === req._id}
                          className="rm-btn-simple"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req._id, "Rejected")}
                          disabled={updatingId === req._id}
                          className="rm-btn-simple"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status === "Approved" && (
                      <button
                        onClick={() => handleClose(req._id)}
                        disabled={updatingId === req._id}
                        className="rm-btn-simple"
                      >
                        Delivered
                      </button>
                    )}
                    {req.status === "Delivered" && <span>Closed</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
