import { Link } from "react-router-dom";
import '../../src/Css/stockdashboard.css';

export default function StockLayout({ title, subtitle, children, active }) {
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
          <Link to="/smdashboard" className={`stock-dashboard-link ${active === "dashboard" ? "active" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>  Dashboard</Link>
          <Link to="/rawmaterialTable" className={`stock-dashboard-link ${active === "materials" ? "active" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brick-wall-icon lucide-brick-wall"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 9v6"/><path d="M16 15v6"/><path d="M16 3v6"/><path d="M3 15h18"/><path d="M3 9h18"/><path d="M8 15v6"/><path d="M8 3v6"/></svg>  Materials</Link>
          <Link to="/rawMaterialRequests" className={`stock-dashboard-link ${active === "requests" ? "active" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-pull-request-icon lucide-git-pull-request"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" x2="6" y1="9" y2="21"/></svg> Requests</Link>
          <Link to="/suplierTable" className={`stock-dashboard-link ${active === "suppliers" ? "active" : ""}`}>🧾 Suppliers</Link>
          <Link to="/stockReport" className={`stock-dashboard-link ${active === "reports" ? "active" : ""}`}>📊 Reports</Link>
          <Link to="/Reqrawmaterial" className={`stock-dashboard-link ${active === "create" ? "active" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-plus-icon lucide-calendar-plus"><path d="M16 19h6"/><path d="M16 2v4"/><path d="M19 16v6"/><path d="M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5"/><path d="M3 10h18"/><path d="M8 2v4"/></svg> Create Request</Link>
        </nav>

        <div className="stock-dashboard-footer">
          <button className="stock-dashboard-signout">⏻ Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="stock-dashboard-main">
        <div className="stock-dashboard-header">
          <div className="stock-dashboard-header-left">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
