import  {useState, useEffect} from "react";
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {FiLogOut} from 'react-icons/fi';
import {Toaster, toast} from 'sonner';
import { Truck, UserCheck, Package, CheckCheck, BarChart3, MapPinned, PackageCheck} from "lucide-react";
import '../Css/DeliveryDashboard.css';
import image from '../images/mainLogo.png'

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

    const [nextDayConfirm, setNextDayConfirm] = useState(null);

    const [assignedDeliveries, setAssignedDeliveries] = useState([]);
    const [completedDeliveries, setCompletedDeliveries] = useState([]);
    const [assignedSearch, setAssignedSearch] = useState([]);
    const [completedSearch, setCompletedSearch] = useState("");

    const [stats, setStats] = useState([]);

    const [reportType, setReportType] = useState("dailyCompleted");
    const [reportData, setReportData] = useState([]);
    const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

    const [darkMode, setDarkMode] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(completedDeliveries.length / itemsPerPage);

    const filteredCompletedDeliveries = completedDeliveries.filter(ad =>
      ad.driver?.name.toLowerCase().includes(completedSearch.toLowerCase()) ||
      ad.deliveries?.some(d => d.orderID.toLowerCase().includes(completedSearch.toLowerCase()))
    );
    
    const sortedFilteredDeliveries = [...filteredCompletedDeliveries].sort(
      (a, b) => new Date(b.endTime) - new Date(a.endTime)
    );
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDeliveries = sortedFilteredDeliveries.slice(indexOfFirstItem, indexOfLastItem);
    

    const pageWindow = 5;

    let startPage = Math.max(currentPage - Math.floor(pageWindow / 2), 1);
    let endPage = startPage + pageWindow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - pageWindow + 1, 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }



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
            fetchStats();
        })
        .catch((error) =>{
            toast.error("Delivery creation failed.")
            console.error("Delivery creation error : ",error);
        })
    }

    const handleSelectDelivery = (delivery) => {
        if (selectDeliveries.some(d => d._id === delivery._id)) {
          setSelectDeliveries([]);
        } else {
          setSelectDeliveries([delivery]);
        }
    };

    const handleReorder = async (id) => {
  try {
    await axios.delete(`http://localhost:8070/api/deliveries/delivery/reorder/${id}`);
    toast.success("Re-order successful!");
    driversDeliveries();
    pendingOrders();
    fetchStats();
  } catch (err) {
    console.error(err);
    toast.error("Failed to re-order");
  }
};

    const handleAssignDelivery = async () => {
        if (selectDeliveries.length === 0) return;

        for (let delivery of selectDeliveries) {
          try {
            const res = await axios.post(`http://localhost:8070/api/deliveries/auto-assign`, {
              deliveryId: delivery._id
            });
            toast.success(res.data.message);
          } catch (err) {
            console.error(err);
            if (err.response?.data?.message) {
              toast.error(err.response.data.message);
            } else {
              toast.error("Failed to auto-assign delivery.");
            }
          }
        }

      setSelectDeliveries([]);
      deliveriesAssigned();
      driversDeliveries();
      fetchStats();
  };

 // ✅ REPORTS SECTION
  const fetchReport = async () => {
    try {
      let url = "";
      switch (reportType) {
        case "dailyCompleted":
          url = "/api/deliveryreports/completed-daily";
          if (startDate && endDate) url += `?start=${startDate}&end=${endDate}`;
          else if (startDate) url += `?start=${startDate}`;
          break;
        case "pending":
          url = "/api/deliveryreports/pending";
          break;
        case "driverPerformance":
          url = "/api/deliveryreports/driver-performance";
          break;
        case "revenueSummary":
          url = "/api/deliveryreports/revenue-summary";
          break;
        default:
          url = "/api/deliveryreports/completed-daily";
      }

      const res = await axios.get(url);
      setReportData(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => { 
    fetchReport(); 
  }, [reportType]);

        const downloadPDF = async () => {
          const pdf = new jsPDF("p", "mm", "a4");

          pdf.setFontSize(18);
          pdf.setFont("helvetica", "bold");
          pdf.text("RUHUNU Yoghurt", 10, 20);
        
          const logoImg = new Image();
          logoImg.src = image; 
          logoImg.onload = () => {
            pdf.addImage(logoImg, "PNG", 160, 10, 40, 20);
 
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Report Type: ${reportType}`, 10, 35);
            pdf.text(`Generated Date: ${new Date().toLocaleDateString()}`, 10, 42);

            const input = document.getElementById("delivery-report-preview");
            html2canvas(input).then((canvas) => {
              const imgData = canvas.toDataURL("image/png");
              const imgProps = pdf.getImageProperties(imgData);
              const pdfWidth = pdf.internal.pageSize.getWidth() - 20; 
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
              pdf.addImage(imgData, "PNG", 10, 50, pdfWidth, pdfHeight);

              const footerY = 50 + pdfHeight + 20;
              pdf.line(10, footerY, 80, footerY);
              pdf.text("Signature", 10, footerY + 6);
            
              pdf.save(`${reportType}.pdf`);
            });
          };
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
                      <h4 className="manager-name"><p>{manager?.position}</p></h4> {/*safe way access not crash*/}
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

        {activeSection === "completed" && (
              <input
                type="text"
                placeholder="Search completed deliveries..."
                value={completedSearch}
                onChange={(e) => setCompletedSearch(e.target.value)}
                className="search-input"
              />
        )}


    

          <div className="stats-row">
            <div className="stat-card blue">Pending Deliveries <br></br>
              <span><strong>{stats?.totalDeliveries}</strong></span>
            </div>

            <div className="stat-card orange">Scheduled Deliveries <br></br>
              <span><strong>{stats?.pending}</strong></span>
            </div>

            <div className="stat-card green">Completed Today<br></br>
              <span><strong>{stats?.completedToday}</strong></span>
            </div>

            <div className="stat-card red">Not Completed Today<br></br>
              <span><strong>{stats?.pendingToday}</strong></span>
            </div>

            <div className="stat-card purple">Active Drivers <br></br>
              <span><strong>{stats?.drivers}</strong></span>
            </div>
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
                            <p>Phone: {order.phone}</p>
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
            className={`delvery-card ${selectDeliveries.some(d => d._id === del._id) ? "selected" : ""}`}
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
          className="delvery-card">

          <p><b>{driver.name}</b></p>
          <p>Capacity: {driver.vehicleCapacity} kg</p>
          <p>Location: {driver.currentLocation || "N/A"}</p>
          <p>Remaining: {driver.remainingCapacity}</p>
          <p>Total: {driver.assignedWeight}</p>
      
        </div>
        ))}
        </div>

        {selectDeliveries.length > 0 && (
        <button className="assign-btn" onClick={handleAssignDelivery} disabled={selectDeliveries.length === 0}>Assign Delivery</button>
        )}
        </div>
      )}

      {activeSection === "deliveries" && (
        <div className="schedule-wrapper">
          <h2><Truck color='#1e3a8a' size={36} /> Scheduled Deliveries</h2>

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
                  disabled={ad.status === "sceduled"}
                  onClick={async () => {
                    try {
                      const res = await axios.post('http://localhost:8070/api/deliveries/auto-schedule', {
                        assignedDeliveryId: ad._id
                      });
                      toast.success(res.data.message);
                      deliveriesAssigned();
                      driversDeliveries();
                      fetchStats();
                    } catch (err) {
                      console.error(err);
                      if (err.response?.data?.suggestNextDay) {
                        setNextDayConfirm({
                          adId: ad._id,
                          message: "Cannot schedule today. Schedule for next day?"
                        });
                      } else {
                        toast.error("Failed to schedule delivery.");
                      }
                    }
                  }}
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

      {nextDayConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{nextDayConfirm.message}</h3>
            <div className="modal-actions">
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post('http://localhost:8070/api/deliveries/schedule-next-day', {
                      assignedDeliveryId: nextDayConfirm.adId
                    });
                    toast.success(res.data.message);
                    deliveriesAssigned();
                    driversDeliveries();
                    fetchStats();
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to schedule for next day.");
                  } finally {
                    setNextDayConfirm(null);
                  }
                }}
              >
                Yes
              </button>
              <button onClick={() => setNextDayConfirm(null)}>No</button>
            </div>
          </div>
        </div>
      )}



      {activeSection === "completed" && (
          <div className="schedule-wrapper">
            <h2><Truck color= '#1e3a8a' size={36} /> Completed Deliveries</h2>
            
            {completedDeliveries.length === 0 && <p>No completed deliveries yet.</p>}
            
            <div className="driver-cards-container">
              {currentDeliveries.map((ad) => (
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
                    <p className="completed-label">Completed</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Prev
                </button>
            
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    className={num === currentPage ? "active" : ""}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

{/* ✅ REPORTS SECTION UPDATED */}
        {activeSection === "reports" && (
          <div className="delivery-report-wrapper">
            <h2 className="delivery-report-title">Reports</h2>

            <select
              className="delivery-report-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="dailyCompleted">Daily Completed Deliveries</option>
              <option value="pending">Pending Deliveries</option>
              <option value="driverPerformance">Driver Performance</option>
              <option value="revenueSummary">Revenue / Cost Summary</option>
            </select>

            {/* 🔹 Date Range Filter only for daily completed */}
            {reportType === "dailyCompleted" && (
              <div className="date-range-filter">
                <label>Start Date: </label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <label>End Date: </label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button className="view-btn" onClick={fetchReport}>
                  View by Date Range
                </button>
              </div>
            )}

            <div id="delivery-report-preview" className="delivery-report-preview">
              {reportType === "dailyCompleted" && (
                <LineChart width={600} height={300} data={reportData}>
                  <XAxis dataKey="employeeID" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="deliveries.length" stroke="#8884d8" />
                </LineChart>
              )}

              {reportType === "driverPerformance" && (
                <BarChart width={600} height={300} data={reportData}>
                  <XAxis dataKey="employeeID" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Bar dataKey="totalDeliveries" fill="#82ca9d" />
                </BarChart>
              )}

              <table className="delivery-report-table">
                <thead>
                  <tr>
                    {reportType === "driverPerformance" ? (
                      <>
                        <th>Driver ID</th>
                        <th>Total Completed Orders</th>
                      </>
                    ) : reportType === "revenueSummary" ? (
                      <>
                        <th>Date</th>
                        <th>Total Deliveries</th>
                        <th>Total Revenue (Rs.)</th>
                      </>
                    ) : (

                      <>
                        <th>Driver ID</th>
                        <th>Order Details</th>
                        <th>Total Weight</th>
                        <th>Status</th>
                        <th>Date</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {reportData
                    .slice()
                    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
                    .map((item, i) => (
                      <tr key={i}>
                        {reportType === "driverPerformance" ? (
                          <>
                            <td>{item.employeeID}</td>
                            <td>{item.totalDeliveries}</td>
                          </>
                        ) : reportType === "revenueSummary" ? (
                          <>
                            <td>{new Date(item.date).toLocaleDateString()}</td>
                            <td>{item.totalDeliveries}</td>
                            <td>{item.totalRevenue}</td>
                          </>
                        ) : (

                          <>
                            <td>{item.employeeID}</td>
                            <td>
                              {item.deliveries?.length > 0 ? (
                                item.deliveries.map((delivery) => (
                                  <div key={delivery._id}>
                                    {delivery.orderID} - {delivery.customerName}
                                  </div>
                                ))
                              ) : (
                                <div>No deliveries</div>
                              )}
                            </td>
                            <td>{item.totalWeight} Kg</td>
                            <td>{item.status}</td>
                            <td>{new Date(item.endTime).toLocaleDateString()}</td>
                          </>
                        )}
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>

            <button className="delivery-report-download" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
        )}
    </main>
    </div>
  );
};