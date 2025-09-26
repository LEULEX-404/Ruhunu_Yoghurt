import  {useState, useEffect} from "react";
import axios from 'axios';
import {FiLogOut} from 'react-icons/fi';
import {Toaster, toast} from 'sonner';
import { Truck, UserCheck, Package, CheckCheck, BarChart3, MapPinned, PackageCheck} from "lucide-react";
import '../Css/DeliveryDashboard.css';

export default function DeliveryDashboard()
{
    const [activeSection, setActiveSection] = useState("createDelivery");

    const [manager, setManager] = useState(null);

    const [orders, setOrders] = useState([]);
    const [orderSearch, setOrderSearch] = useState([]);

    const [deliveries, setDeliveries] = useState([]);
    const [deliverySearch, setDeliverySearch] = useState([]);

    const [drivers, setDrivers] = useState([]);
    const [selectDeliveries, setSelectDeliveries] = useState([]);
    const [selectDriver, setSelectDriver] = useState(null);

    const [assignedDeliveries, setAssignedDeliveries] = useState([]);
    const [completedDeliveries, setCompletedDeliveries] = useState([]);
    const [assignedSearch, setAssignedSearch] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [sceduleDeliveryId, setSceduleDeliveryId] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [stats, setStats] = useState([]);

    const [darkMode, setDarkMode] = useState(false);

    const fetchManager = async () => {
      try{
        const storedManager = localStorage.getItem("user");
        console.log('deliveryManager', storedManager);

        if(storedManager){
          const pareseManager = JSON.parse(storedManager);

          const res = await axios.get(`http://localhost:8070/api/deliveries/manager/${pareseManager.id}`);
          setManager(res.data);
        };
      }
      catch(err){
        console.error(err);
      }
    }

    const pendingOrders = async () =>{
          try{
            const res = await axios.get(`http://localhost:8070/api/deliveries/pending`)
            setOrders(res.data)
        }catch(err) {
            toast.error("Failed to fetch orders");
        }
    };

    const searchOrders = async (searchText) =>{
      try{
        if(!searchText){
          return pendingOrders();
        }
        const res = await axios.get(
          `http://localhost:8070/api/deliveries/search/orders?search=${searchText}`
        );
        setOrders(res.data);
      }
      catch(err){
        console.error(err);
        toast.error("Failed to search orders.")
      }
    };
      const driversDeliveries = async () =>{
          try{
            const res = await axios.get(`http://localhost:8070/api/deliveries/assign`)
            setDeliveries(res.data.Deliveries || []);
            setDrivers(res.data.Drivers || []);
        }catch(err){
            console.error(err);
            toast.error("Failed to fetch drivers or deliveries.");
        }
    };


    const searchDeliveriesAndDrivers = async (searchText) => {
      try{
        if(!searchText){
          return driversDeliveries();
        }

        const res = await axios.get(
          `http://localhost:8070/api/deliveries/search/deliveries?search=${searchText}`
        );
        setDeliveries(res.data.Deliveries || []);
        setDrivers(res.data.Drivers || []);
      }
      catch(err){
        console.error(err);
        toast.error("Failed to search deliveries or Drivers.")
      }
    };

      const deliveriesAssigned = async () =>{
          try{
            const res = await axios.get('http://localhost:8070/api/deliveries/deliveries')
            const deliveriesArray = Array.isArray(res.data) ? res.data : [];
            setAssignedDeliveries(deliveriesArray);
        }catch(err){
            console.error(err);
            toast.error("Failed to fetch assigned deliveries.");
        };
    };

      const deliveriesCompleted = async () =>{
          try{
            const res = await axios.get('http://localhost:8070/api/deliveries/deliveries/completed')
            const deliveriesArray = Array.isArray(res.data) ? res.data : [];
            setCompletedDeliveries(deliveriesArray);
        }catch(err){
            console.error(err);
            toast.error("Failed to fetch assigned deliveries.");
        };
    };

    const searchAssignedDeliveries = async (searchText) =>{
      try{
        if(!searchText){
          return deliveriesAssigned();
        }
        const res = await axios.get(
          `http://localhost:8070/api/deliveries/search/assigned?search=${searchText}`
        );
        setAssignedDeliveries(res.data);
      }
      catch(err){
        console.error(err);
        toast.error("Failed to search assigned deliveries.")
      }
    }
    const fetchStats = async () =>{
      try{
        const res = await axios.get('http://localhost:8070/api/deliveries/stats')
        setStats(res.data);
      }
      catch(err)
      {
        toast.error("Failed to fetch Stats.")
      }
    }

    useEffect(() =>{

        fetchManager();

        pendingOrders();
      
        driversDeliveries();
        
        deliveriesAssigned();

        deliveriesCompleted();

        searchAssignedDeliveries();

        fetchStats();
        
    },[])

    useEffect(() =>{
      const delayDebounce = setTimeout(() =>{
        searchOrders(orderSearch);
      },400);

      return() => clearTimeout(delayDebounce);
    }, [orderSearch]);

    useEffect(() =>{
      const delayDebounce = setTimeout(() =>{
        searchDeliveriesAndDrivers(deliverySearch);
      },400);

      return() => clearTimeout(delayDebounce);
    }, [deliverySearch]);

    useEffect(() =>{
      const delayDebounce = setTimeout(() =>{
        searchAssignedDeliveries(assignedSearch);
      },400);
      return() => clearTimeout(delayDebounce);
    }, [assignedSearch]);

    const handleCreateDelivery = (orderNumber) =>{
        axios.post(`http://localhost:8070/api/deliveries/create`,{orderNumber}).then(() =>{
            toast.success("Delivery created Successfully.")
            driversDeliveries();
            pendingOrders();
        })
        .catch((error) =>{
            toast.error("Delivery creation failed.")
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

    const handleReorder = async (id) => {
  try {
    await axios.delete(`http://localhost:8070/api/deliveries/delivery/reorder/${id}`);
    toast.success("Re-order successful!");
    driversDeliveries();
    pendingOrders();
  } catch (err) {
    console.error(err);
    toast.error("Failed to re-order");
  }
};

    const handleAssignDelivery = () =>{
        if(!selectDriver || selectDeliveries.length === 0)return;
        const deliveryIds = selectDeliveries.map(d => d._id);

        axios.post(`http://localhost:8070/api/deliveries/assign`,{
            driverId: selectDriver.driverID,
            deliveryIds
        })
        .then(res =>{
            toast.success(res.data.message);
            setSelectDeliveries([]);
            setSelectDriver(null);
            deliveriesAssigned();
            driversDeliveries();
        })
        .catch(err => {
        console.error(err);
        if(err.response.data.message){
            toast.error(err.response.data.message);
        } else {
            toast.error("Failed to assign delivery.");
        }});
    };

    const handleSchedule = (assignedId) => {
      setSceduleDeliveryId(assignedId);
      setShowModal(true);
    };

    const submitSchedule = () => {
  if(!validateSchedule()){
        return;
      }

      axios.post('http://localhost:8070/api/deliveries/schedule', {
        assignedDeliveryId: sceduleDeliveryId,
        startTime,
        endTime
      })
      .then(res =>{
        toast.success(res.data.message);
        setShowModal(false);
        setStartTime("");
        setEndTime("");
        deliveriesAssigned();
      })
      .catch(err =>{
        console.error(err);
        toast.error("Failed to scedule delivery");
      });
    };

    const validateSchedule = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      const startHour =start.getHours();
      const endHour = end.getHours();
      const endMinute = end.getMinutes();

      const minStartTime = new Date(now.getTime() + 60 * 60 * 1000);

      if(!startTime || !endTime){
        toast.error("Please select start and end time.");
        return false;
      }

      if(startHour < 8 || startHour > 11){
        toast.error("Start time must be between 8 AM and 11 AM.");
        return false;
      }

      if(start < now){
        toast.error("Start time cannot be in the past.");
        return false;
      }

      if(start < minStartTime){
        toast.error("Start time must be at least 1 hour from now.");
        return false;
      }

      if(end <= start){
        toast.error("End time must be later than start time.");
        return false;
      }
      
      if(endHour < 14 || (endHour === 17 && endMinute > 0) || endHour > 17){
          toast.error("End time must be between 2 PM and 5 PM.");
          return false;
      }

      return true;
    };

    const toggleDarkMode = () =>{
        setDarkMode(!darkMode);
        if(!darkMode){
            document.body.classList.add("dark-mode");
        }
        else{
            document.body.classList.remove("dark-mode");
        }
    };

    const handleSignout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("SignOut Successfully!");
      setTimeout(()=>{
        window.location.href = "/login";
      },1500);
    };



    return(
        <div className="dashboard-wrapper">
          <Toaster position="bottom-center"richColors/>
            <aside className = "sidebar">
                <h2>Delivery Management</h2>
                <div className="manager-card">  
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3237/3237472.png" 
                      alt="Manager"
                      className="manager-avatar"
                    />
                    <div>
                      <h4 className="manager-name"><p>{manager?.position}</p></h4>
                      <p className="manager-role">{manager?.name}</p>
                      <p className="manager-role">{manager?.employeeID}</p>
                      <p className="manager-role">{manager?.email}</p>
                      
                    </div>
                  </div>
                <ul>
                    <li className = {activeSection === "createDelivery" ? "active" : ""}onClick = {() => setActiveSection ("createDelivery")}><Package size={18} /> Create Delivery</li>
                    <li className = {activeSection === "assignDriver"? "active" : ""}onClick = {() => setActiveSection ("assignDriver")}><UserCheck size={18} /> Assign Driver</li>
                    <li className = {activeSection === "deliveries"? "active" : ""}onClick = {() => setActiveSection ("deliveries")}><Truck size={18} /> Deliveries</li>
                    <li className = {activeSection === "completed"? "active" : ""}onClick = {() => setActiveSection ("completed")}><CheckCheck size={18} /> Completed</li>
                    <li className = {activeSection === "reports"? "active" : ""}onClick = {() => setActiveSection ("reports")}><BarChart3 size={18} /> Reports</li>
                </ul>
                <div className="bottom-content">
              <li className="mode">
                  <span className="modetext">Dark Mode</span>
                <label className="switch">
                  <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                  <span className="slider"></span>
                </label>
                </li>
                <button className="deliver-signout-btn" onClick={handleSignout}>
                  <FiLogOut/>Sign Out
                </button>
              </div>
            </aside>

        <main className="main-content">
        <h1>Dairy Product Delivery Management</h1>
        <p className="subtitle">Monitor and manage all delivery operations</p>
        {activeSection === "createDelivery" && (
          <input
                  type="text"
                  placeholder="Search pending orders..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="search-input"
                />
        )}

        {activeSection === "assignDriver" && (
          <input
                  type="text"
                  placeholder="Search delivery or driver..."
                  value={deliverySearch}
                  onChange={(e) => {
                      setDeliverySearch(e.target.value);
                      searchDeliveriesAndDrivers(e.target.value);
                    }}
                  className="search-input"
                />
        )}

        {activeSection === "deliveries" && (
          <input
                  type="text"
                  placeholder="Search assigned deliveries..."
                  value={assignedSearch}
                  onChange={(e) => setAssignedSearch(e.target.value)}
                  className="search-input"
                />
        )}

        
        
        
        <div className="stats-row">
          <div className="stat-card blue">Pending Deliveries <br></br>
            <span><strong>{stats?.totalDeliveries}</strong></span></div>

          <div className="stat-card orange">Scheduled Deliveries <br></br>
            <span><strong>{stats?.pending}</strong></span></div>

          <div className="stat-card green">Completed Deliveries<br></br>
            <span><strong>{stats?.completed}</strong></span></div>

          <div className="stat-card purple">Active Drivers <br></br>
            <span><strong>{stats?.drivers}</strong></span></div>
        </div>

        {activeSection === "createDelivery" && (
            <div>
                <div className = "order-list">
                    {orders.map(order => (
                        <div key ={order._id} className ="order-card">
                          <div className="order-info">
                            <p><b>{order.orderNumber}</b></p>
                            <p>{order.customerName}</p>
                            <p>Total Rs.{order.total}</p>
                            <p>Address: {order.address}</p>
                            <p>Weight: {order.productWeight} kg</p>
                          </div>

                          <div className="order-items">
                            <h4>Items:</h4>
                            <ul>
                                 {order.items?.map((item, index) => (
                                 <li key={index}>
                                    {item.product} - {item.quantity}
                                </li>
                                ))}
                            </ul>
                          </div>
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
            <p>Distance: {del.distanceKm} Km</p>
            <p>Cost: Rs. {del.cost}</p>
            <button 
              className="reorder-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleReorder(del._id);
              }}
            >
              Re-Order
            </button>
          </div>
          
        ))}
        </div>

        <div className="side drivers-side">
          <h3>Available Drivers</h3>
          {drivers
          .slice()
          .sort((a,b) => a.remainingCapacity - b.remainingCapacity)
          .map(driver => (
        <div
          key={driver._id}
          className={`card ${selectDriver?._id === driver._id ? "selected" : ""}`}
          onClick={() => handleSelectDriver(driver)}
          >
          <p><b>{driver.name}</b></p>
          <p>Capacity: {driver.vehicleCapacity} kg</p>
          <p>Location: {driver.currentLocation || "N/A"}</p>
          <p>Remaining: {driver.remainingCapacity}</p>
          <p>Total: {driver.assignedWeight}</p>
      
        </div>
        ))}
        </div>

        {selectDeliveries.length > 0 && selectDriver && (
        <button className="assign-btn" onClick={handleAssignDelivery} disabled={!selectDriver || selectDeliveries.length === 0}>Assign Delivery</button>
        )}
        </div>
      )}

      {activeSection === "deliveries" && (
      <div className="schedule-wrapper">
      <h2><Truck color= '#1e3a8a' size={36} /> Scheduled Deliveries</h2>

      {assignedDeliveries.length === 0 && <p>No assigned deliveries yet.</p>}

      <div className="driver-cards-container">
        {assignedDeliveries.map((ad) => (
          <div key={ad._id} className="driver-card">
            <div className="driver-header">
              <h3>{ad.driver?.name || "Unknown Driver"}</h3>

      <p className="status-label"
           style={{
          color: ad.status === "sceduled" ? "green" : "red",
          fontWeight: "bold",
          marginTop: "5px",
          textTransform: "uppercase",
          fontSize: "12px",
          backdropFilter: "blur(5px)",
          backgroundColor: ad.status === "sceduled" ? "rgba(0, 128, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
          padding: "2px 6px",
          borderRadius: "4px",
          width: "fit-content"
        }}>
        {ad.status === "sceduled" ? "Scheduled" : "Not Scheduled"}
      </p>

              <p className="capacity">Capacity: {ad.driver?.vehicleCapacity} kg</p>
              <p className="location"><MapPinned color='red' size={22}/> {ad.driver?.currentLocation || "N/A"}</p>
            </div>

            <div className="driver-info">
              <p><b>Total Weight:</b> {ad.totalWeight} kg</p>
              <p><b>Assigned On:</b> {new Date(ad.assignDate).toLocaleDateString()}</p>
            </div>

            <div className="delivery-list">
              <h4><PackageCheck color='blue' size={32}/> Deliveries:</h4>
              <ul>
                {ad.deliveries?.map((d, i) => (
                  <li key={i}>
                    <b>{d.orderID}</b> - {d.customerName}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="schedule-btn"
              onClick={() => handleSchedule(ad._id)}
              disabled={ad.status === "sceduled"}
              style={{
                backgroundColor: ad.status === "sceduled" ? "#ccc" : "#007bff",
                cursor: ad.status === "sceduled" ? "not-allowed" : "pointer",
              }}
            >
              {ad.status === "sceduled" ? "Scheduled" : "Schedule"}
            </button>
          </div>
          
        ))}

      </div>
    </div>
    )}

    {activeSection === "completed" && (
      <div className="schedule-wrapper">
      <h2><Truck color= '#1e3a8a' size={36} /> Completed Deliveries</h2>

      {completedDeliveries.length === 0 && <p>No completed deliveries yet.</p>}
      <div className="driver-cards-container">
        {completedDeliveries.map((ad) => (
          <div key={ad._id} className="driver-card">
            <div className="driver-header">
              <h3>{ad.driver?.name || "Unknown Driver"}</h3>
              <p className="capacity">Capacity: {ad.driver?.vehicleCapacity} kg</p>
            </div>
            <div className="driver-info">
              <p><b>Total Weight:</b> {ad.totalWeight} kg</p>
              <p><b>Assigned On:</b> {new Date(ad.assignDate).toLocaleDateString()}</p>
              <p><b>Start Time:</b> {new Date(ad.startTime).toLocaleTimeString()}</p>
              <p><b>End Time:</b> {new Date(ad.endTime).toLocaleTimeString()}</p>
            </div>
            <div className="delivery-list">
              <h4><PackageCheck color='blue' size={32}/> Deliveries:</h4>
              <ul>
                {ad.deliveries?.map((d, i) => (
                  <li key={i}>
                    <b>{d.orderID}</b> - {d.customerName} - {d.status}
                  </li>
                ))}
              </ul>
              <p className="completed-label">
                  Completed
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    )}
    </main>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Set Schedule Time</h2>

              <label>Start Time:</label>
              <input 
                type="datetime-local" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />

              <label>End Time:</label>
              <input 
                type="datetime-local" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />

              <div className="modal-actions">
                <button onClick={submitSchedule}>Confirm</button>
                <button onClick={() => {
                  setShowModal(false);
                  setStartTime("");
                  setEndTime("")}}>Cancel</button>
              </div>
            </div>
          </div>
      )}
    </div>
    );
};