import React, { useState, useEffect, useRef } from "react";
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,BarChart,Bar,PieChart,Pie,Cell,Legend,} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../images/mainLogo.png";
import "../Css/OrderReport.css";

const ReportsSection = () => {
  const [reportType, setReportType] = useState("sales");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setFromDate(today);
    setToDate(today);
    fetchReport(today, today);
  }, []);

  const fetchReport = async (from = fromDate, to = toDate) => {
    if (!from || !to) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({ from, to });
      const res = await fetch(`http://localhost:8070/api/orders?${params.toString()}`);
      const orders = await res.json();

      const fromTime = new Date(from).getTime();
      const toTime = new Date(to).getTime();

      
      const filteredOrders = orders.filter((o) => {
        const orderTime = new Date(o.createdAt).getTime();
        return orderTime >= fromTime && orderTime <= toTime;
      });

      
      const dailyDataMap = {};
      filteredOrders.forEach((o) => {
        const date = o.createdAt.split("T")[0];
        if (!dailyDataMap[date]) {
          dailyDataMap[date] = {
            date,
            orders: 0,
            revenue: 0,
            paymentCOD: 0,
            paymentPayNow: 0,
            statusCount: { Completed: 0, pending: 0, "Ready to Assign": 0, cancelled: 0 },
          };
        }

        dailyDataMap[date].orders += 1;
        dailyDataMap[date].revenue += o.total || 0;

       
        const payment = o.total || 0;
        if (o.priority === "Low") {
          dailyDataMap[date].paymentCOD += payment;
        } else if (o.priority === "High") {
          dailyDataMap[date].paymentPayNow += payment;
        }

        const status = o.status || "pending";
        if (dailyDataMap[date].statusCount[status] != null) {
          dailyDataMap[date].statusCount[status] += 1;
        }
      });

      setData(Object.values(dailyDataMap));
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const pdf = new jsPDF("p", "pt", "a4");
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    pdf.setFontSize(14);
    pdf.text("RUHUNU Yoghurt", 40, 40);
    pdf.addImage(logo, "PNG", 450, 15, 100, 40);

    pdf.setFontSize(12);
    pdf.text(`Report Type: ${getReportTitle()}`, 40, 70);
    pdf.text(`Generated Date: ${new Date().toLocaleDateString()}`, 40, 90);

    pdf.addImage(imgData, "PNG", 0, 110, 595, 400);

    pdf.setFontSize(12);
    pdf.text("Authorized Signature: ______________________", 40, 540);

    pdf.save(`${getReportTitle()}_${new Date().toLocaleDateString()}.pdf`);
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "sales":
        return "Sales & Revenue Report";
      case "order":
        return "Order Status Summary";
      case "payment":
        return "Payment Summary";
      default:
        return "";
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>

      
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select
          className="border rounded px-3 py-2"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="sales">Sales & Revenue Report</option>
          <option value="order">Order Status Summary</option>
          <option value="payment">Payment Summary</option>
        </select>

        <label>From:</label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <label>To:</label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

            <button className="report-button report-button-blue" onClick={() => fetchReport()}>
              Generate Report
            </button>

            <button className="report-button report-button-green" onClick={downloadPDF}>
              Download PDF
            </button>

      </div>

      <div ref={reportRef} className="report-card">
        <h3 className="text-xl font-semibold mb-4">{getReportTitle()}</h3>

        {loading ? (
          <p>Loading data...</p>
        ) : data.length === 0 ? (
          <p>No data for selected range.</p>
        ) : (
          <>
            {/* Sales Report */}
            {reportType === "sales" && (
              <>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d, i) => (
                      <tr key={i}>
                        <td>{d.date}</td>
                        <td>{d.orders}</td>
                        <td>Rs. {d.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <LineChart width={600} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#0088FE" />
                </LineChart>
              </>
            )}

            {/* Order Status Report */}
            {reportType === "order" && (
              <>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Completed</th>
                      <th>Pending</th>
                      <th>Ready To assign</th>
                      <th>Cancelled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d, i) => (
                      <tr key={i}>
                        <td>{d.date}</td>
                        <td>{d.statusCount.Completed}</td>
                        <td>{d.statusCount.pending}</td>
                        <td>{d.statusCount["Ready to Assign"]}</td>
                        <td>{d.statusCount.cancelled}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <PieChart width={400} height={300}>
                  <Pie
                    data={[
                      { name: "Completed", value: data.reduce((acc, d) => acc + d.statusCount.Completed, 0) },
                      { name: "Pending", value: data.reduce((acc, d) => acc + d.statusCount.pending, 0) },
                      { name: "Ready to Assign", value: data.reduce((acc, d) => acc + d.statusCount["Ready to Assign"], 0) },
                      { name: "Cancelled", value: data.reduce((acc, d) => acc + d.statusCount.cancelled, 0) },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </>
            )}

            {/* Payment Report */}
            {reportType === "payment" && (
              <>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>COD (Rs.)</th>
                      <th>PayNow (Rs.)</th>
                      <th>Total Payment (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d, i) => (
                      <tr key={i}>
                        <td>{d.date}</td>
                        <td>Rs. {d.paymentCOD.toFixed(2)}</td>
                        <td>Rs. {d.paymentPayNow.toFixed(2)}</td>
                        <td>Rs. {(d.paymentCOD + d.paymentPayNow).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <BarChart width={600} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(val) => `Rs. ${val}`} />
                  <Bar dataKey="paymentCOD" fill="#FFBB28" name="COD" />
                  <Bar dataKey="paymentPayNow" fill="#00C49F" name="PayNow" />
                </BarChart>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsSection;
