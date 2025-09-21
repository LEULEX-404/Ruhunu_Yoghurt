import { useState, useEffect } from "react";
import axios from 'axios';
import "../Css/DriverPortal.css";

export default function DriverPortal() {

  const [driver, setDriver] = useState(null);

  const [activeSection, setActiveSection] = useState("profile");


  const fetchDriver = async ()=>{
        
    const storedDriver = localStorage.getItem("user");
    console.log('driver:',storedDriver)
    
    if(storedDriver)
    {
       const parsedDriver = JSON.parse(storedDriver);
      
      const res = await axios.get(`http://localhost:8070/api/driver/${parsedDriver.id}`);
      setDriver(res.data);
      
  }
}

  useEffect(() => {

    fetchDriver();
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
              <p><strong>Name:</strong>{driver?.name}</p>
              <p><strong>Email:</strong>{driver?.email}</p>
              <p><strong>Phone:</strong>{driver?.phone}</p>
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
