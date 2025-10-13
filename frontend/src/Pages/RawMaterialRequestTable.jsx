import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../../src/Css/stockdashboard.css';
import '../../src/Css/RawMaterialRequestTable.css';

export default function RawMaterialRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch requests from backend
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

  // Update request status (approve/reject)
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

  // Mark request as delivered
  const handleClose = async (id) => {
    if (!window.confirm("Mark this request as delivered?")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:8070/api/raw-material/requests/${id}/close`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) fetchRequests();
      else alert(data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // ✅ Filtered Requests
  const filteredRequests = requests.filter((req) =>
    filterStatus === "All" ? true : req.status === filterStatus
  );

  return (
    <div className="stock-dashboard-container">
      {/* Sidebar */}
      <aside className="stock-dashboard-sidebar">
        <h2 className="stock-dashboard-logo">
          Stock<br />Management
        </h2>

        <div className="stock-dashboard-profile">
          <div className="stock-dashboard-avatar">👤</div>
          <div>
            <h4 className="stock-dashboard-name">Kalindu</h4>
            <p className="stock-dashboard-email">Kalindu@gmail.com</p>
          </div>
        </div>

        <nav className="stock-dashboard-nav">
          <Link to="/smdashboard" className="stock-dashboard-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> Dashboard
          </Link>
          <Link to="/rawmaterialTable" className="stock-dashboard-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brick-wall-icon lucide-brick-wall"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 9v6"/><path d="M16 15v6"/><path d="M16 3v6"/><path d="M3 15h18"/><path d="M3 9h18"/><path d="M8 15v6"/><path d="M8 3v6"/></svg> Materials
          </Link>
          <Link to="/rawMaterialRequests" className="stock-dashboard-link active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-pull-request-icon lucide-git-pull-request"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" x2="6" y1="9" y2="21"/></svg> Requests
          </Link>
          <Link to="/suplierTable" className="stock-dashboard-link">🧾 Suppliers</Link>
          <Link to="/stockReport" className="stock-dashboard-link">📊 Reports</Link>
          <Link to="/Reqrawmaterial" className="stock-dashboard-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-plus-icon lucide-calendar-plus"><path d="M16 19h6"/><path d="M16 2v4"/><path d="M19 16v6"/><path d="M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5"/><path d="M3 10h18"/><path d="M8 2v4"/></svg> Create Request</Link>
        </nav>

        <div className="stock-dashboard-footer">
          <button className="stock-dashboard-signout">⏻ Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="stock-dashboard-main">
        {/* Header */}
        <div className="stock-dashboard-header">
          <div className="stock-dashboard-header-left">
            <h1>📦 Raw Material Requests</h1>
            <p>Manage, approve, and track raw material requests</p>
          </div>

          <div className="stock-dashboard-header-right">
            <Link to="/addrawmaterialform" className="rm-manage-stock-btn">
              ⚡ Manage Stock
            </Link>
          </div>
        </div>

        {/* ✅ Status Filter */}
        <div className="rm-filter-container">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
            className="rm-filter-select"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {loading ? (
          <p className="rm-loading">Loading requests...</p>
        ) : (
          <div className="rm-table-container">
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
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="rm-no-data">No requests found</td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req._id}>
                        <td>{req.requestId}</td>
                        <td>{req.supplierId?.name || "N/A"}</td>
                        <td>{req.materialId?.name || "N/A"}</td>
                        <td>{req.quantity}</td>
                        <td>{req.unit}</td>
                        <td className={`rm-status-text ${req.status.toLowerCase()}`}>{req.status}</td>
                        <td>{new Date(req.requestedAt).toLocaleString()}</td>
                        <td className="rm-actions">
                          {req.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(req._id, "Approved")}
                                disabled={updatingId === req._id}
                                className="rm-btn-simple approve"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(req._id, "Rejected")}
                                disabled={updatingId === req._id}
                                className="rm-btn-simple reject"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {req.status === "Approved" && (
                            <button
                              onClick={() => handleClose(req._id)}
                              disabled={updatingId === req._id}
                              className="rm-btn-simple delivered"
                            >
                              Delivered
                            </button>
                          )}
                          {req.status === "Delivered" && (
                            <span className="rm-closed">Closed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
