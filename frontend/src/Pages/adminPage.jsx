import { useEffect, useState } from "react";
import axios from "axios";
import "../Css/adminPage.css";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import AddProductPage from "./admin/addProduct";
import AdminProductPage from "./admin/productsPage";
import EditProductPage from "./admin/editProduct";

export default function AdminPage() {
  const location = useLocation();
  const path = location.pathname;

  const [stats, setStats] = useState({
    availableCount: 0,
    unavailableCount: 0,
    expiringProducts: [],
  });

  const [user, setUser] = useState({ name: "", position: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ name: payload.name, position: payload.role });
    }

    axios
      .get("/api/products/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  function getClass(track) {
    return path.includes(track) ? "active-link" : "inactive-link";
  }

  return (
    <>
      <nav className="admin-nav">
        <div className="nav-left">
          <Link className={getClass("products")} to="/admin/products">
            Products
          </Link>
        </div>
        <div className="nav-right">
          <button
            className="btn-logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <header className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p>{user.position}</p>
      </header>

      <div className="dashboard-cards">
        <div className="card">
          <h2>Available Products</h2>
          <p>{stats.availableCount}</p>
        </div>
        <div className="card">
          <h2>Unavailable Products</h2>
          <p>{stats.unavailableCount}</p>
        </div>
        <div className="card">
          <h2>Products Expiring in 7 Days</h2>
          <ul>
            {stats.expiringProducts.map((p, index) => (
              <li key={index}>{p.productId}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="report-container">
        <h2>Reports</h2>
        <p>
          Detailed reports and analytics can be displayed here.
        </p>
      </div>

      <div className="admin-routes">
        <Routes>
          <Route path="/products" element={<AdminProductPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product" element={<EditProductPage />} />
        </Routes>
      </div>
    </>
  );
}
