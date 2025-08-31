import React,{useState, useEffect} from "react";
import axios from 'axios';
import '../Css/DelieryDashboard.css';

export default function DelieryDashboard()
{
    const [activeSection, setActiveSection] = useState("createDelivery");

    const [orders, setOrders] = useState([]);

    const [deliveries, setDeliveries] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectDeliveries, setSelectDeliveries] = useState([]);
    const [selectDriver, setSelectDriver] = useState(null);

    const [assignedDeliveries, setAssignedDeliveries] = useState([]);

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() =>{
        axios.get(`http://localhost:8070/api/deliveries/pending`).then((res) =>{
            setOrders(res.data)
        }).catch((err) =>{
            alert("Failed to fetch orders");
        })

        axios.get(`http://localhost:8070/api/deliveries/assign`).then((res) =>{
            setDeliveries(res.data.Deliveries || []);
            setDrivers(res.data.Drivers || []);
        })
        .catch((err) =>{
            console.error(err);
            alert("Failed to fetch drivers or deliveries.");
        })
        
        axios.get('http://localhost:8070/api/deliveries/deliveries').then((res) =>{
            setAssignedDeliveries(res.data || []);
        })
        .catch((err) =>{
            console.error(err);
            alert("Failed to fetch assigned deliveries.");
        });
    },[])

    const handleCreateDelivery = (orderNumber) =>{
        axios.post(`http://localhost:8070/api/deliveries/create`,{orderNumber}).then(() =>{
            alert("Delivery created Successfully.")
        })
        .catch((error) =>{
            alert("Delivery creation failed.")
            console.error("Delivery creation error : ",error);
        })
    }

    const handleSelectDelivery = (delivery) =>{
        if(selectDeliveries.some(d => d._id === delivery._id)){
            setSelectDeliveries(selectDeliveries.filter(d => d._id !== delivery._id));
        }
        else{
            setSelectDeliveries([...selectDeliveries, delivery])
        }
    }
    const handleSelectDriver = (driver) =>{
        setSelectDriver(driver);
    }

    const handleAssignDelivery = () =>{
        if(!selectDriver || selectDeliveries.length === 0)return;
        const deliveryIds = selectDeliveries.map(d => d._id);
        axios.post(`http://loclhost:8070/api/deliveries/assign`,{
            driverId: selectDriver._id,
            deliveryIds
        })
        .then(res =>{
            alert(res.data.message);
            setSelectDeliveries([]);
            setSelectDriver(null);
        })
        .catch(err => console.error(err));
    }

    const toggleDarkMode = () =>{
        setDarkMode(!darkMode);
        if(!darkMode){
            document.body.classList.add("dark-mode");
        }
        else{
            document.body.classList.remove("dark-mode");
        }
    };

    const handleSchedule = (driverId) =>{
        alert(`Schedule deliveries for driver ${driverId}`);
    };

    return(
        <div className="dashboard-wrapper">
            <aside className = "sidebar">
                <h2>Delivery Management</h2>
                <ul>
                    <li className = {activeSection === "createDelivery" ? "active" : ""}onClick = {() => setActiveSection ("createDelivery")}>📬 Create Delivery</li>
                    <li className = {activeSection === "assignDriver"? "active" : ""}onClick = {() => setActiveSection ("assignDriver")}>✅ Assign Driver</li>
                    <li className = {activeSection === "deliveries"? "active" : ""}onClick = {() => setActiveSection ("deliveries")}>📦 Deliveries</li>
                    <li className = {activeSection === "feedback"? "active" : ""}onClick = {() => setActiveSection ("feedback")}>💬 Feedback</li>
                    <li className = {activeSection === "reports"? "active" : ""}onClick = {() => setActiveSection ("reports")}>📊 Reports</li>
                </ul>
                <div className="bottom-content">
              <li className="mode">
                  <span className="modetext">Dark Mode</span>
                <label className="switch">
                  <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                  <span className="slider"></span>
                </label>
                </li>
              </div>
            </aside>

        <main className="main-content">
        <h1>Dairy Product Delivery Management</h1>
        <p className="subtitle">Monitor and manage all delivery operations</p>
        
        <div className="stats-row">
          <div className="stat-card blue">Total Deliveries <span>totalDeliveries</span></div>
          <div className="stat-card orange">Pending <span>pending</span></div>
          <div className="stat-card green">Completed Today <span>completedToday</span></div>
          <div className="stat-card purple">Active Drivers <span>activeDrivers</span></div>
        </div>

        {activeSection === "createDelivery" && (
            <div>
                <h2>Pending Orders</h2>
                <div className = "order-list">
                    {orders.map(order => (
                        <div key ={order._id} className ="order-card">
                            <p><b>{order.orderNumber}</b></p>
                            <p>{order.customerName}</p>
                            <p>Total Rs.{order.total}</p>
                            <p>Address: {order.address}</p>
                            <p>Weight: {order.productWeight} kg</p>

                            <h4>Items:</h4>
                            <ul>
                                 {order.items.map((item, index) => (
                                 <li key={index}>
                                    {item.product} - {item.quantity}
                                </li>
                                ))}
                            </ul>
                        <button onClick={() => handleCreateDelivery(order.orderNumber)}>Convert to Delivery</button>
                    </div>
                    ))}
                </div>
            </div>
        )}

        {activeSection === "assignDriver" && (
        <div className="assign-section">
          <div className="side deliveries-side">
            <h3>Pending Deliveries</h3>
            {deliveries.map(del => (
          <div
            key={del._id}
            className={`card ${selectDeliveries.some(d => d._id === del._id) ? "selected" : ""}`}
            onClick={() => handleSelectDelivery(del)}
            >
            <p><b>{del.orderID}</b></p>
            <p>{del.customerName}</p>
            <p>Weight: {del.productWeight} kg</p>
            <p>Address: {del.address}</p>
          </div>
        ))}
        </div>

        <div className="side drivers-side">
          <h3>Available Drivers</h3>
          {drivers.map(driver => (
        <div
          key={driver._id}
          className={`card ${selectDriver?._id === driver._id ? "selected" : ""}`}
          onClick={() => handleSelectDriver(driver)}
          >
          <p><b>{driver.name}</b></p>
          <p>Capacity: {driver.vehicleCapacity} kg</p>
          <p>Location: {driver.currentLocation || "N/A"}</p>
        </div>
        ))}
        </div>

        {selectDeliveries.length > 0 && selectDriver && (
        <button className="assign-btn" onClick={handleAssignDelivery}>Assign Delivery</button>
        )}
        </div>
      )}

      {activeSection === "deliveries" && (
    <div className="schedule-wrapper">
      <h2>🚚 Scheduled Deliveries</h2>

      {assignedDeliveries.length === 0 && <p>No assigned deliveries yet.</p>}

      <div className="driver-cards-container">
        {assignedDeliveries.map((ad) => (
          <div key={ad._id} className="driver-card">
            <div className="driver-header">
              <h3>{ad.driver?.name || "Unknown Driver"}</h3>
              <p className="capacity">Capacity: {ad.driver?.vehicleCapacity} kg</p>
              <p className="location">📍 {ad.driver?.currentLocation || "N/A"}</p>
            </div>

            <div className="driver-info">
              <p><b>Total Weight:</b> {ad.totalWeight} kg</p>
              <p><b>Assigned On:</b> {new Date(ad.assignDate).toLocaleDateString()}</p>
            </div>

            <div className="delivery-list">
              <h4>📦 Deliveries:</h4>
              <ul>
                {ad.deliveries.map((d, i) => (
                  <li key={i}>
                    <b>{d.orderID}</b> - {d.customerName} ({d.productWeight} kg)
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="schedule-btn"
              onClick={() => handleSchedule(ad.driver?._id)}
            >
              Schedule
            </button>
          </div>
        ))}
      </div>
    </div>
    )}
    </main>
    </div>
    )
}