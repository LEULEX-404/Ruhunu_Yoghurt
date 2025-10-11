import { useState } from "react";
import { Link } from "react-router-dom";
import "../../Css/stockdashboard.css";

export default function StockDashboard() {
  const [search, setSearch] = useState("");

  const stockStats = [
    { label: "📈 Stocks", count: 5, color: "#c90f0fff" },
    { label: "📉 Low Stock", count: 18, color: "#3b82f6" },
    { label: "🕘 Pending ", count: 2, color: "#9cf808ff" },
    { label: "✅️ Completed", count: 7, color: "#a7aacaff" },
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
          <Link to="/rawMaterialRequests" className="stock-dashboard-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Deliveries</Link>
          <Link to="/suplierTable" className="stock-dashboard-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-container-icon lucide-container"><path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"/><path d="M10 21.9V14L2.1 9.1"/><path d="m10 14 11.9-6.9"/><path d="M14 19.8v-8.1"/><path d="M18 17.5V9.4"/></svg> Suppliers</Link>
          <Link to="/stockReport" className="stock-dashboard-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-minus-icon lucide-clipboard-minus"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6"/></svg> Reports</Link>
          <Link to="/Reqrawmaterial" className="stock-dashboard-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-pull-request-draft-icon lucide-git-pull-request-draft"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 6V5"/><path d="M18 11v-1"/><line x1="6" x2="6" y1="9" y2="21"/></svg> Create Request </Link>
          
        </nav>

        <div className="stock-dashboard-footer">
          <button className="stock-dashboard-signout"> ⏻ Sign Out</button>
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
                type=" text"
                placeholder=" Search stock status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
          </div>
        </div>

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
      </main>
    </div>
  );
}
