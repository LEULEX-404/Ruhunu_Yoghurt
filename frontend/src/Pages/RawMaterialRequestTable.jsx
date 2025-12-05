import { useEffect, useState } from "react";

export default function RawMaterialRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8070/api/requests");
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

  // Update status
  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:8070/api/requests/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchRequests();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Close request
  const handleClose = async (id) => {
    if (!window.confirm("Mark this request as delivered?")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:8070/api/requests/${id}/close`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchRequests();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "auto" }}>
      <h2>📦 Raw Material Requests</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f4f4f4" }}>
          <tr>
            <th>Request ID</th>
            <th>Supplier</th>
            <th>Material</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Status</th>
            <th>Requested Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No requests found</td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr key={req._id}>
                <td>{req.requestId}</td>
                <td>{req.supplierId?.name || "N/A"}</td>
                <td>{req.materialId?.name || "N/A"}</td>
                <td>{req.quantity}</td>
                <td>{req.unit}</td>
                <td style={{ fontWeight: "bold" }}>{req.status}</td>
                <td>{new Date(req.requestedAt).toLocaleString()}</td>
                <td>
                  {req.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "Approved")}
                        disabled={updatingId === req._id}
                        style={{ background: "green", color: "white", marginRight: 5 }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req._id, "Rejected")}
                        disabled={updatingId === req._id}
                        style={{ background: "red", color: "white", marginRight: 5 }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {req.status === "Approved" && (
                    <button
                      onClick={() => handleClose(req._id)}
                      disabled={updatingId === req._id}
                      style={{ background: "blue", color: "white" }}
                    >
                      Mark Delivered
                    </button>
                  )}
                  {req.status === "Delivered" && <span>✅ Closed</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
