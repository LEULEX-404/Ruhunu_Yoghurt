import React, { useEffect, useState } from "react";
import axios from "axios";
import StockLayout from "../../Pages/Stocklayout.jsx"; // Sidebar layout
import '../../Css/reportpage.css';

const ReportPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supRes, reqRes] = await Promise.all([
          axios.get("/api/report/suppliers"),
          axios.get("/api/report/requests"),
        ]);
        setSuppliers(supRes.data);
        setRequests(reqRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleExport = async (id) => {
    try {
      const res = await axios.get(`/api/report/export/${id}`, {
        responseType: "blob", // Important: get binary data
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `request_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  return (
    <StockLayout title=" Reports" subtitle="Supplier performance & request history" active="reports">
      <div className="report-section">
        <h2>📊 Supplier Performance</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Total Requests</th>
              <th>Delivered</th>
              <th>Pending</th>
              <th>Rejected</th>
              <th>Delivery Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No suppliers data</td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.total}</td>
                  <td>{s.delivered}</td>
                  <td>{s.pending}</td>
                  <td>{s.rejected}</td>
                  <td>{((s.delivered / s.total) * 100).toFixed(1)}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="report-section">
        <h2>📦 Request History</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Supplier</th>
              <th>Material</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Export</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>No request data</td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r._id}>
                  <td>{r.requestId}</td>
                  <td>{r.supplierId?.name}</td>
                  <td>{r.materialId?.name}</td>
                  <td>{r.quantity}</td>
                  <td>{r.unit}</td>
                  <td>
                    <span className={`status ${r.status?.toLowerCase() || "pending"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>{new Date(r.requestedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleExport(r._id)}
                      className="report-export-btn"
                    >
                      Export PDF
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
};

export default ReportPage;
