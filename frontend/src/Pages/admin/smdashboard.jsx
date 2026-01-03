import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../Css/stockdashboard.css";

export default function StockDashboard() {
  const [stats, setStats] = useState({
    totalStocks: 0,
    lowStocks: 0,
    pendingRequests: 0,
    completedRequests: 0,
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8070/api/stock/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const stockStats = [
    { label: "📈 Stocks", count: stats.totalStocks, color: "#c90f0fff" },
    { label: "📉 Low Stock", count: stats.lowStocks, color: "#3b82f6" },
    { label: "🕘 Pending", count: stats.pendingRequests, color: "#9cf808ff" },
    { label: "✅ Completed", count: stats.completedRequests, color: "#a7aacaff" },
  ];

  const filteredStats = stockStats.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
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
          <Link to="/rawmaterialTable" className="stock-dashboard-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brick-wall-icon lucide-brick-wall"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 9v6"/><path d="M16 15v6"/><path d="M16 3v6"/><path d="M3 15h18"/><path d="M3 9h18"/><path d="M8 15v6"/><path d="M8 3v6"/></svg> Materials</Link>
          <Link to="/rawMaterialRequests" className="stock-dashboard-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-pull-request-icon lucide-git-pull-request"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" x2="6" y1="9" y2="21"/></svg> Requests</Link>
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
        <div className="stock-dashboard-header">
          <div className="stock-dashboard-header-left">
            <h1>Stock Overview</h1>
            <p>Monitor and manage all stock levels and updates</p>
          </div>

          <div className="stock-dashboard-header-right">
            <div className="stock-dashboard-search">
              <input
                type="text"
                placeholder="Search stock status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stock-dashboard-stats">
          {filteredStats.map((stat, i) => (
            <div
              key={i}
              className="stock-dashboard-card"
              style={{ borderTop: `5px solid ${stat.color}` }}
            >
              <h3>{stat.label}</h3>
              <p>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Transaction History Button */}
        <div className="stock-dashboard-history">
          <Link to="/rawmaterialhistory" className="stock-dashboard-history-btn">
            🧾 Transaction History
          </Link>
        </div>
        
      </main>
    </div>
  );
}
