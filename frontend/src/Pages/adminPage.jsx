import { useEffect, useState } from "react";
import axios from "axios";
import "../Css/adminPage.css";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import AddProductPage from "./admin/addProduct";
import AdminProductPage from "./admin/productsPage";
import EditProductPage from "./admin/editProduct";
import DamageProduct from "./admin/damageProduct";
import ReportPage from "./admin/reportPage";

export default function AdminPage() {
  const location = useLocation();
  const path = location.pathname;

  const [damages, setDamages] = useState([]);
  const [stats, setStats] = useState({
    availableCount: 0,
    unavailableCount: 0,
    expiringProducts: [],
    totalSales: 0,
    totalRevenue: 0,
  });
  const [user, setUser] = useState({ name: "", position: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser({ name: payload.name, position: payload.role });

    const fetchData = async () => {
      try {
        const [statsRes, damagesRes, paymentsRes] = await Promise.all([
          axios.get("/api/products/admin", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/damage", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/payments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const payments = paymentsRes.data;

        // Calculate total sales and revenue
        const totalRevenue = payments.reduce((acc, p) => acc + p.total, 0);
        const totalSales = payments.length;

        setStats({
          availableCount: statsRes.data.availableCount,
          unavailableCount: statsRes.data.unavailableCount,
          expiringProducts: statsRes.data.expiringProducts || [],
          totalSales,
          totalRevenue,
        });

        setDamages(damagesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  function getClass(track) {
    return path.includes(track) ? "active-link" : "inactive-link";
  }

  return (
    <div className="admin-page">
      {/* 🔹 Navigation */}
      <nav className="admin-nav">
        <div className="nav-left">
          <Link className={getClass("dashboard")} to="/admin">
            Dashboard
          </Link>
          <Link className={getClass("products")} to="/admin/products">
            Products
          </Link>
          <Link className={getClass("report")} to="/admin/report">
            Reports
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

      {/* 🔹 Page Routes */}
      <div className="admin-content">
        <Routes>
          {/* Dashboard */}
          <Route
            index
            element={
              <>
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

                  {/* 🧾 Added Sales and Revenue cards */}
                  <div className="card">
                    <h2>Total Sales</h2>
                    <p>{stats.totalSales}</p>
                  </div>
                  <div className="card">
                    <h2>Total Revenue</h2>
                    <p>Rs.{stats.totalRevenue.toLocaleString()}</p>
                  </div>

                  <div className="card">
                    <h2>Expiring in 7 Days</h2>
                    {stats.expiringProducts.length === 0 ? (
                      <p>No products expiring soon.</p>
                    ) : (
                      <ul>
                        {stats.expiringProducts.map((p, i) => (
                          <li key={i}>{p.productId}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="card damage-card">
                    <h2>Damage Products</h2>
                    {damages.length === 0 ? (
                      <p>No damage records yet.</p>
                    ) : (
                      <ul>
                        {damages.map((dmg, i) => (
                          <li key={i}>
                            {dmg.name} — {dmg.quantity}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            }
          />

          {/* Other Pages */}
          <Route path="/products" element={<AdminProductPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product" element={<EditProductPage />} />
          <Route path="/damage-log" element={<DamageProduct />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
    </div>
  );
}
