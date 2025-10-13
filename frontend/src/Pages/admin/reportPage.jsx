import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import companyLogo from "../../images/mainLogo.png";
import "../../Css/productReportPage.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { createRoot } from "react-dom/client";

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
  const [signature, setSignature] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [payments, setPayments] = useState([]);

  const reportRef = useRef();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return toast.error("Please login first");

    const fetchData = async () => {
      try {
        const [statsRes, damageRes, paymentRes] = await Promise.all([
          axios.get("/api/products/admin", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/damage", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/payments", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setPayments(paymentRes.data);

        const productList = [
          ...new Set(paymentRes.data.flatMap((p) => p.products.map((pr) => pr.productInfo.name))),
        ];

        // Prepare monthly sales
        const monthlySales = {};
        paymentRes.data.forEach((payment) => {
          const month = new Date(payment.date).toLocaleString("default", { month: "short", year: "numeric" });
          payment.products.forEach((pr) => {
            const key = pr.productInfo.name + "_" + month;
            if (!monthlySales[key]) monthlySales[key] = { month, name: pr.productInfo.name, quantity: 0 };
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

        // Default month = latest
        const latestMonth = new Date(paymentRes.data[paymentRes.data.length - 1].date);
        setSelectedMonth(latestMonth.toLocaleString("default", { month: "short", year: "numeric" }));
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch report data");
      }
    };

    fetchData();
  }, [token]);

  // Filter payments for selected month
  const filteredPayments = payments.filter(
    (p) => new Date(p.date).toLocaleString("default", { month: "short", year: "numeric" }) === selectedMonth
  );

  const totalSalesMonth = filteredPayments.length;
  const totalRevenueMonth = filteredPayments.reduce((acc, p) => acc + p.total, 0);

  const filteredSales = salesData.filter((s) => s.name === selectedProduct);

  // High damage products
  const damageCountMap = {};
  damages.forEach((d) => {
    if (!damageCountMap[d.name]) damageCountMap[d.name] = 0;
    damageCountMap[d.name] += d.quantity;
  });
  const highDamageProducts = Object.entries(damageCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Unique months
  const uniqueMonths = [...new Set(payments.map((p) =>
    new Date(p.date).toLocaleString("default", { month: "short", year: "numeric" })
  ))];

  // Signature
  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setSignature(event.target.result);
    reader.readAsDataURL(file);
  };

  // PDF download (all product charts)
  const downloadPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const html2canvas = (await import("html2canvas")).default;

    const pdf = new jsPDF("p", "pt", "a4");

    try {
      // --- Summary page ---
      const summaryCanvas = await html2canvas(reportRef.current.querySelector(".report-summary-section"), { scale: 2 });
      const summaryImg = summaryCanvas.toDataURL("image/png");
      const imgWidth = 550;
      const imgHeight = (summaryCanvas.height * imgWidth) / summaryCanvas.width;
      pdf.addImage(companyLogo, "PNG", 40, 30, 80, 60);
      pdf.setFontSize(18);
      pdf.text(`Inventory Report - ${selectedMonth}`, 150, 60);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 150, 80);
      pdf.addImage(summaryImg, "PNG", 25, 110, imgWidth, imgHeight);

      // --- Hidden container for product charts ---
      const hiddenContainer = document.createElement("div");
      hiddenContainer.style.position = "fixed";
      hiddenContainer.style.left = "-9999px";
      document.body.appendChild(hiddenContainer);

      for (const product of products) {
        const chartDiv = document.createElement("div");
        chartDiv.style.width = "600px";
        chartDiv.style.height = "350px";
        hiddenContainer.appendChild(chartDiv);

        const productData = salesData.filter((s) => s.name === product);
        const ChartComponent = (
          <ResponsiveContainer width={600} height={350}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

        const root = createRoot(chartDiv);
        root.render(ChartComponent);

        await new Promise((res) => setTimeout(res, 500));
        const canvas = await html2canvas(chartDiv, { scale: 2 });
        const chartImg = canvas.toDataURL("image/png");
        const chartHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text(`Sales Trend: ${product}`, 40, 50);
        pdf.addImage(chartImg, "PNG", 25, 80, imgWidth, chartHeight);

        hiddenContainer.removeChild(chartDiv);
      }

      document.body.removeChild(hiddenContainer);

      // --- Signature page ---
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text("Authorized Signature", 50, 100);
      if (signature) pdf.addImage(signature, "PNG", 50, 110, 100, 50);
      else {
        pdf.line(50, 140, 200, 140);
        pdf.text("(Not Provided)", 210, 140);
      }
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 50, 200);

      pdf.save(`Inventory_Report_${selectedMonth}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="report-container" ref={reportRef}>
      <h1>Reports Dashboard</h1>

      {/* Month Selector */}
      <div className="report-section">
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {uniqueMonths.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Summary Section */}
      <div className="report-summary-section">
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
            <p>{totalSalesMonth}</p>
          </div>
          <div className="summary-card">
            <h3>Total Revenue</h3>
            <p>Rs.{totalRevenueMonth.toLocaleString()}</p>
          </div>
        </div>

        {/* Damage Section */}
        <div className="report-section">
          <h2>Products with High Damage Count</h2>
          {highDamageProducts.length === 0 ? <p>No damaged products recorded</p> : (
            <table className="damage-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Damage Count</th>
                </tr>
              </thead>
              <tbody>
                {highDamageProducts.map(([name, quantity], i) => (
                  <tr key={i}><td>{name}</td><td>{quantity}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Product selector for UI chart */}
      <div className="report-section">
        <h2>Sales Trend per Product</h2>
        <select className="product-select" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
          {products.map((p, i) => <option key={i} value={p}>{p}</option>)}
        </select>

        <div className="chart-container">
          {filteredSales.length === 0 ? <p>No sales data for this product.</p> : (
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

      {/* Signature Preview */}
      <div className="signature-preview">
        {signature ? <>
          <p><b>Signature Preview:</b></p>
          <img src={signature} alt="Signature" />
        </> : <p>No signature uploaded.</p>}
      </div>

      {/* PDF Download */}
      <div className="report-actions">
        <button className="download-btn" onClick={downloadPDF}>Download PDF</button>
        <label className="signature-upload">
          Upload Signature
          <input type="file" accept="image/*" onChange={handleSignatureChange} hidden />
        </label>
      </div>
    </div>
  );
}
