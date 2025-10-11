import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get("/api/report/suppliers").then(res => setSuppliers(res.data));
    axios.get("/api/report/requests").then(res => setRequests(res.data));
  }, []);

  const handleExport = (id) => {
    window.open(`/api/report/export/${id}`, "_blank");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Supplier Performance</h2>
      <table className="w-full border mb-10">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Supplier</th>
            <th>Total Requests</th>
            <th>Delivered</th>
            <th>Pending</th>
            <th>Rejected</th>
            <th>Delivery Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s._id}>
              <td className="p-2">{s.name}</td>
              <td>{s.total}</td>
              <td>{s.delivered}</td>
              <td>{s.pending}</td>
              <td>{s.rejected}</td>
              <td>{((s.delivered / s.total) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mb-4">Request History</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
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
          {requests.map((r) => (
            <tr key={r._id}>
              <td>{r.requestId}</td>
              <td>{r.supplierId?.name}</td>
              <td>{r.materialId?.name}</td>
              <td>{r.quantity}</td>
              <td>{r.unit}</td>
              <td>{r.status}</td>
              <td>{new Date(r.requestedAt).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleExport(r._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Export PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportPage;
