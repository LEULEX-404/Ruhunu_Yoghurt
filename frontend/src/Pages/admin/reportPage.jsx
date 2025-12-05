import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../../Css/reportPage.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ReportPage() {
  const [stats, setStats] = useState({
    availableCount: 0,
    unavailableCount: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const [damages, setDamages] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return toast.error("Please login first");

    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await axios.get("/api/products/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch all damages
        const damageRes = await axios.get("/api/damage", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch sales data
        const paymentRes = await axios.get("/api/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Prepare product list for dropdown
        const productList = [...new Set(paymentRes.data.flatMap(p => p.products.map(pr => pr.productInfo.name)))];

        // Prepare monthly sales data (grouped by month & product)
        const monthlySales = {};

        paymentRes.data.forEach(payment => {
          const month = new Date(payment.date).toLocaleString("default", { month: "short", year: "numeric" });
          payment.products.forEach(pr => {
            const key = pr.productInfo.name + "_" + month;
            if (!monthlySales[key]) {
              monthlySales[key] = { month, name: pr.productInfo.name, quantity: 0 };
            }
            monthlySales[key].quantity += pr.quantity;
          });
        });

        setSalesData(Object.values(monthlySales));
        setStats({
          availableCount: statsRes.data.availableCount,
          unavailableCount: statsRes.data.unavailableCount,
          totalSales: paymentRes.data.length,
          totalRevenue: paymentRes.data.reduce((acc, p) => acc + p.total, 0),
        });
        setDamages(damageRes.data);
        setProducts(productList);
        setSelectedProduct(productList[0] || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch report data");
      }
    };

    fetchData();
  }, [token]);

  const filteredSales = salesData.filter(s => s.name === selectedProduct);

  // Compute high damage products
  const damageCountMap = {};
  damages.forEach(d => {
    if (!damageCountMap[d.name]) damageCountMap[d.name] = 0;
    damageCountMap[d.name] += d.quantity;
  });
  const highDamageProducts = Object.entries(damageCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // top 5

  return (
    <div className="report-container">
      <h1>Reports Dashboard</h1>

      {/* Summary Cards */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>Available Products</h3>
          <p>{stats.availableCount}</p>
        </div>
        <div className="summary-card">
          <h3>Unavailable Products</h3>
          <p>{stats.unavailableCount}</p>
        </div>
        <div className="summary-card">
          <h3>Total Sales</h3>
          <p>{stats.totalSales}</p>
        </div>
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p>Rs.{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* High Damage Products */}
      <div className="report-section">
        <h2>Products with High Damage Count</h2>
        {highDamageProducts.length === 0 ? (
          <p>No damaged products recorded</p>
        ) : (
          <table className="damage-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Damage Count</th>
              </tr>
            </thead>
            <tbody>
              {highDamageProducts.map(([name, quantity], index) => (
                <tr key={index}>
                  <td>{name}</td>
                  <td>{quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Sales Trend Chart */}
      <div className="report-section">
        <h2>Sales Trend per Product</h2>
        <select
          className="product-select"
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
        >
          {products.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>

        <div className="chart-container">
          {filteredSales.length === 0 ? (
            <p>No sales data for this product.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
