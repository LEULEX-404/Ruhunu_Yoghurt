import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import StockLayout from "../../Pages/Stocklayout.jsx";
import '../../Css/Rawhistory.css';

export default function RawMaterialWithHistory() {
  const [history, setHistory] = useState([]);
  const [filterType, setFilterType] = useState("All");

  // ✅ Fetch all history records
  const fetchHistory = async () => {
    try {
      const res = await axios.get("/api/raw-material-history");
      setHistory(res.data);
    } catch (err) {
      toast.error("Failed to fetch history");
    }
  };

  // ✅ Export history as PDF
  const handleExportPDF = async () => {
    try {
      const response = await axios.get("/api/raw-material-history/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "history_report.pdf";
      link.click();

      toast.success("PDF downloaded successfully");
    } catch (err) {
      toast.error("Failed to export PDF");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ✅ Filtered History
  const filteredHistory = history.filter((item) =>
    filterType === "All" ? true : item.action === filterType
  );

  return (
    <StockLayout
      title="Raw Material History"
      subtitle="Track raw material transactions"
      active="history"
    >
      {/* Export and Filter Row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div className="filter-container">
          <label htmlFor="transactionFilter">Filter by Transaction:</label>
          <select
            id="transactionFilter"
            onChange={(e) => setFilterType(e.target.value)}
            value={filterType}
            className="filter-select"
          >
            <option value="All">All</option>
            <option value="Add">Add</option>
            <option value="Remove">Remove</option>
          </select>
        </div>

        <button onClick={handleExportPDF} className="export-btn">
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>MID</th>
              <th>Name</th>
              <th>Transaction Type</th>
              <th>Quantity</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No history found</td>
              </tr>
            ) : (
              filteredHistory.map((h) => (
                <tr key={h._id}>
                  <td>{h.MID}</td>
                  <td>{h.name}</td>
                  <td className={h.action === "Add" ? "history-add" : "history-remove"}>
                    {h.action}
                  </td>
                  <td>{h.quantity}</td>
                  <td>{new Date(h.time).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </StockLayout>
  );
}
