import { useState, useEffect } from "react";
import axios from 'axios';
import "../Css/DriverPortal.css";

export default function DriverPortal() {

  const [driver, setDriver] = useState(null);

  const [activeSection, setActiveSection] = useState("profile");


  useEffect(() => {
    const storedDriver = localStorage.getItem("user");
    if(storedDriver)
    {
      setDriver(JSON.parse(storedDriver));
    }
  },[])

  return (
    <div className="portal-container">
      <div className="driversidebar">
        <h2 className="logo">Driver Portal</h2>
        <nav>
          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Driver Profile
          </button>
          <button
            className={activeSection === "performance" ? "active" : ""}
            onClick={() => setActiveSection("performance")}
          >
            Performance Points
          </button>
          <button
            className={activeSection === "history" ? "active" : ""}
            onClick={() => setActiveSection("history")}
          >
            History & Deliveries
          </button>
        </nav>
      </div>

      <div className="main-content">
        {activeSection === "profile" && (
          <div className="section">
            <h2>Driver Profile</h2>
            <div className="card">
              <p><strong>Name:</strong>ima</p>
              <p><strong>License No:</strong> ABC12345</p>
              <p><strong>Phone:</strong> +94 71 123 4567</p>
            </div>
          </div>
        )}

        {activeSection === "performance" && (
          <div className="section">
            <h2>Performance Points</h2>
            <div className="card">
              <p><strong>Total Points:</strong> 120</p>
              <p><strong>Rank:</strong> Gold Driver</p>
              <p><strong>Achievements:</strong> On-time deliveries</p>
            </div>
          </div>
        )}

        {activeSection === "history" && (
          <div className="section">
            <h2>Delivery History</h2>
            <div className="card">
              <p><strong>Order #1001</strong> - Completed</p>
              <p><strong>Order #1002</strong> - Completed</p>
              <p><strong>Order #1003</strong> - Assigned</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
