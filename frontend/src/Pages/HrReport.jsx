import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ updated import
import '../Css/HrReport.css'
import image from '../images/mainLogo.png';

export default function Reports() {
  const [reportType, setReportType] = useState("payroll");
  const [employees, setEmployees] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filteredPayroll, setFilteredPayroll] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)));
  const [endDate, setEndDate] = useState(new Date());

  // Fetch employees and drivers
  useEffect(() => {
    const fetchData = async () => {
      const empRes = await axios.get("https://ruhunu-yoghurt-1.onrender.com/api/hrreports/employees");
      const driverRes = await axios.get("https://ruhunu-yoghurt-1.onrender.com/api/hrreports/drivers");
      setEmployees(empRes.data);
      setDrivers(driverRes.data);
    };
    fetchData();
  }, []);

  // Fetch attendance by range
  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await axios.get(`https://ruhunu-yoghurt-1.onrender.com/api/hrreports/attendance?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      setAttendance(res.data);
    };
    if (reportType === "attendance") fetchAttendance();
  }, [reportType, startDate, endDate]);

  // Merge driver points
  const getDriverPoints = (employeeID) => {
    const driver = drivers.find(d => d.employeeID === employeeID);
    return driver ? driver.points : 0;
  };

  // Base salary
  const baseSalaryMap = {
    "Driver": 50000,
    "Staff": 70000,
    "HR Manager": 120000,
    "Product Manager": 100000,
    "Stock Manager": 100000,
    "Delivery Manager": 100000,
    "Order Manager": 100000,
    "Unassigned": 20000
  };

  // Filter payroll
  useEffect(() => {
    let filtered = employees
      .filter(emp => positionFilter === "All" || emp.position.includes(positionFilter))
      .filter(emp => emp.name.toLowerCase().includes(searchText.toLowerCase()) || emp.employeeID.includes(searchText))
      .map(emp => {
        const bonus = emp.position === "Driver" ? getDriverPoints(emp.employeeID) * 50 : 0;
  
        // Get attendance records for this employee
        const empAttendance = attendance.filter(a => a.employeeID === emp.employeeID);
  
        // Generate all dates in the selected range
        const getAllDates = (start, end) => {
          const dates = [];
          let current = new Date(start);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
          return dates;
        };
        const allDates = getAllDates(startDate, endDate);
  
        // Count total present, late, absent
        let totalPresent = 0;
        let totalLate = 0;
        let totalAbsent = 0;
  
        allDates.forEach(date => {
          const record = empAttendance.find(a => new Date(a.date).toDateString() === date.toDateString());
          const lateTime = new Date(date);
          lateTime.setHours(9, 30, 0, 0);
  
          if (!record || !record.checkInTime) totalAbsent += 1;
          else if (new Date(record.checkInTime) > lateTime) totalLate += 1;
          else totalPresent += 1;
        });
  
        // Attendance-based deduction logic
        const absentDeduction = Math.floor(Math.max(totalAbsent - 3, 0) / 3) * 500;
        const lateDeduction = Math.floor(Math.max(totalLate - 3, 0) / 3) * 200;
        const totalDeduction = absentDeduction + lateDeduction;
  
        const base = baseSalaryMap[emp.position] || 30000;
  
        return {
          ...emp,
          baseSalary: base,
          bonus,
          deductions: totalDeduction,
          netSalary: base + bonus - totalDeduction,
          totalPresent,
          totalLate,
          totalAbsent
        };
      });
  
    setFilteredPayroll(filtered);
  }, [employees, drivers, attendance, searchText, positionFilter, startDate, endDate]);
  

  // Filter attendance summary
  useEffect(() => {
    if (reportType !== "attendance") return;
  
    // Generate all dates in the selected range
    const getAllDates = (start, end) => {
      const dates = [];
      let current = new Date(start);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };
  
    const allDates = getAllDates(startDate, endDate);
  
    const summary = employees
      .filter(emp => positionFilter === "All" || emp.position.includes(positionFilter))
      .filter(emp => emp.name.toLowerCase().includes(searchText.toLowerCase()) || emp.employeeID.includes(searchText))
      .map(emp => {
        let totalPresent = 0;
        let totalLate = 0;
        let totalAbsent = 0;
  
        allDates.forEach(date => {
          // Find attendance for this employee on this date
          const record = attendance.find(a => a.employeeID === emp.employeeID && new Date(a.date).toDateString() === date.toDateString());
  
          const lateTime = new Date(date);
          lateTime.setHours(9, 30, 0, 0);
  
          if (!record || !record.checkInTime) {
            totalAbsent += 1; // absent
          } else {
            const checkIn = new Date(record.checkInTime);
            if (checkIn > lateTime) totalLate += 1;
            else totalPresent += 1;
          }
        });
  
        return {
          ...emp,
          totalPresent,
          totalLate,
          totalAbsent
        };
      });
  
    setFilteredAttendance(summary);
  }, [attendance, employees, searchText, positionFilter, reportType, startDate, endDate]);
  
  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Add logo (top-right)
    const logoImg = new Image();
    logoImg.src = image; 
    logoImg.onload = () => {
      const imgWidth = 30; // width in mm
      const imgHeight = (logoImg.height / logoImg.width) * imgWidth;
      doc.addImage(logoImg, 'PNG', pageWidth - imgWidth - 10, 10, imgWidth, imgHeight); 
  
      // Add title and header
      doc.setFontSize(16);
      doc.text("RUHUNU Yoghurts HR Reports", 14, 20);
      doc.setFontSize(12);
      doc.text(`Report Type: ${reportType === "payroll" ? "Payroll" : "Attendance"}`, 14, 28);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);
  
      if (reportType === "payroll") {
        const columns = ["ID", "Name", "Position", "Base", "Bonus", "Deductions", "Net"];
        const rows = filteredPayroll.map(emp => [
          emp.employeeID, emp.name, emp.position, emp.baseSalary, emp.bonus, emp.deductions, emp.netSalary
        ]);
        autoTable(doc, { head: [columns], body: rows, startY: 45 });
      } else {
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const columns = ["ID", "Name", "Position", "Total Days", "Present", "Late", "Absent"];
        const rows = filteredAttendance.map(emp => [
          emp.employeeID,
          emp.name,
          emp.position,
          totalDays,
          emp.totalPresent,
          emp.totalLate,
          emp.totalAbsent
        ]);
        autoTable(doc, { head: [columns], body: rows, startY: 45 });
      }
  
      // Signature line below table
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 60;
      doc.setFontSize(12);
      doc.text("__________________________", 14, finalY);
      doc.text("Authorized Signature", 14, finalY + 6);
  
      // Save PDF
      doc.save(`${reportType}_report.pdf`);
    };
  };
  
  
  return (
    <div className="hr-reports-content-card">
      <h2>HR Reports</h2>

      <div className="hr-reports-filters">
        <label>Report Type:</label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="payroll">Payroll</option>
          <option value="attendance">Attendance</option>
        </select>

        <label>Position:</label>
        <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Manager">Manager</option>
          <option value="Driver">Driver</option>
          <option value="Staff">Staff</option>
        </select>

        <label>Search:</label>
        <input type="text" placeholder="Name or ID" value={searchText} onChange={(e) => setSearchText(e.target.value)} />

        {reportType === "attendance" && (
          <div className="hr-reports-date-range">
            <label>Start Date:</label>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat="yyyy-MM-dd" />
            <label>End Date:</label>
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat="yyyy-MM-dd" />
          </div>
        )}

        <button onClick={exportPDF} className="hr-reports-submit-btn"><FiDownload /> Download PDF</button>
      </div>

      {reportType === "payroll" && (
        <table className="hr-reports-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Position</th><th>Base</th><th>Bonus</th><th>Deductions</th><th>Net</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayroll.map(emp => (
              <tr key={emp.employeeID}>
                <td>{emp.employeeID}</td>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.baseSalary}</td>
                <td>{emp.bonus}</td>
                <td>{emp.deductions}</td>
                <td>{emp.netSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {reportType === "attendance" && (
        <table className="hr-reports-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Position</th><th>Present</th><th>Late</th><th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map(emp => (
              <tr key={emp.employeeID}>
                <td>{emp.employeeID}</td>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.totalPresent}</td>
                <td>{emp.totalLate}</td>
                <td>{emp.totalAbsent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
