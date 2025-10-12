import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../../Css/smdashboard.css";

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const cards = [
    { title: "Product Stock", path: "/productStock", icon: "📦" },
    { title: "Material Stock", path: "/rawmaterialTable", icon: "🥛" },
    { title: "Suppliers", path: "/suplierTable", icon: "🚚" },
    { title: "Reports", path: "/reports", icon: "📊" },
  ];

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard-container">
      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header section */}
      <div className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">Stock Dashboard</h1>

        {/*AddStock Button */}
        <Link to="/addrawmaterialform" className="add-stock-btn">
          ➕ Add Stock
        </Link>
      </div>

      {/* Search bar */}
      <div className="admin-dashboard-search">
        <input
          type="text"
          placeholder="Search here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="admin-dashboard-grid">
        {filteredCards.map((card, index) => (
          <Link
            to={card.path}
            key={index}
            className="admin-dashboard-card"
            onClick={() => toast.success(`${card.title} opened!`)}
          >
            <div className="admin-dashboard-icon">{card.icon}</div>
            <h2>{card.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
