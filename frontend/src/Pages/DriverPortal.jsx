import { useState, useEffect } from "react";
import { Toaster,toast } from "sonner";
import axios from 'axios';
import "../Css/DriverPortal.css";

export default function DriverPortal() {

  const [driver, setDriver] = useState(null);
  const [delivery, setDelivery] = useState([]);
  const [completedDelivery, setCompletedDelivery] = useState([]);

  const [activeSection, setActiveSection] = useState("profile");

  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");



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

const fetchDeliveries = async () =>{

  const storedDriver = localStorage.getItem("user");
  console.log('driver:',storedDriver)

  if(storedDriver){
      const parsedDriver = JSON.parse(storedDriver);

      const res = await axios.get(`http://localhost:8070/api/driver/delivery/${parsedDriver.id}`);
      setDelivery(res.data);
      console.log(res.data);
  }
}

const fetchCompletedDeliveries = async () =>{

  const storedDriver = localStorage.getItem("user");
  console.log('driver:',storedDriver)

  if(storedDriver){
      const parsedDriver = JSON.parse(storedDriver);

      const res = await axios.get(`http://localhost:8070/api/driver/delivery/completed/${parsedDriver.id}`);
      setCompletedDelivery(res.data);
      console.log(res.data);
  }
}

const handleCompleteDelivery = async (deliveryId) => {
  try{
    await axios.put(`http://localhost:8070/api/driver/complete/${deliveryId}`);

    fetchDeliveries();
    fetchCompletedDeliveries();
    fetchDriver()
}
catch(err){
  console.error("Error completing delivery:",err);
  alert("Failed to complete delivery");
}
};

const validateProfile = () => {
    if (!editName.trim()) {
      toast.error("Name is required");
      return false;
    }

  const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(editName)) {
      toast.error("Name can only contain letters");
    return false;
    }

    if (!editEmail.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      toast.error("Enter a valid email address");
      return false;
    }

    if (!editPhone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    const phoneRegex = /^0+[0-9]{9}$/;
    if (!phoneRegex.test(editPhone)) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

const handleUpdateProfile = async () => {
     try {

      if (!validateProfile()) {
        return;
      }
      const storedDriver = JSON.parse(localStorage.getItem("user"));
      await axios.put(`http://localhost:8070/api/driver/${storedDriver.id}`, {
        name: editName,
        email: editEmail,
        phone: editPhone
      });

      setShowModal(false);
      fetchDriver();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
}


  useEffect(() => {

    fetchDriver();
    fetchDeliveries();
    fetchCompletedDeliveries();
  },[])

  return (
    <div className="portal-container">
      <Toaster position="bottom-center"richColors/>
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
            className={activeSection === "deliveries" ? "active" : ""}
            onClick={() => setActiveSection("deliveries")}
          >
            Deliveries
          </button>
           <button
            className={activeSection === "history" ? "active" : ""}
            onClick={() => setActiveSection("history")}
          >
            History
          </button>
        </nav>
      </div>

      <div className="main-content">
        {activeSection === "profile" && (
        <div className="section">
          <h2>Driver Profile</h2>
          <div className="profile-card">
            <div className="profile-header">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3237/3237472.png" 
                alt="Driver Avatar" 
                className="profile-avatar"
              />
              <div className="profile-info">
                <h3>{driver?.name}</h3>
                <p><strong>Email:</strong> {driver?.email}</p>
                <p><strong>Phone:</strong> {driver?.phone}</p>
              </div>
            </div>
        
            <div className="profile-stats">
              <div className="driver-stat-card">
                <h4>{driver?.points}</h4>
                <p>Performance Points</p>
              </div>
              <div className="driver-stat-card">
                <h4>{completedDelivery.length}</h4>
                <p>Completed Deliveries</p>
              </div>
              <div className="driver-stat-card">
                <h4>{delivery.length}</h4>
                <p>Ongoing Deliveries</p>
              </div>
            </div>
        
            <div className="profile-actions">
              <button 
                  className="update-btn" 
                  onClick={() => {
                    setEditName(driver?.name || "");
                    setEditEmail(driver?.email || "");
                    setEditPhone(driver?.phone || "");
                    setShowModal(true);
                  }}
                >
                  Update Profile
              </button>
              <button className="signout-btn" 
                onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/login";
                }}
              >Sign Out</button>
            </div>
          </div>
        </div>
      )}





        {activeSection === "deliveries" && (
          <div className="driver-delivery-section">
            <h2>Deliveries</h2>
            <div className="card">
              {delivery.map(del =>(
                <div key = {del._id} className="driver-delivery-card">
                <p><strong>Total Weight: </strong>{del.totalWeight} Kg</p>
                <p><strong>Assign Date: </strong>{new Date(del.assignDate).toLocaleDateString()}</p>
                <p><strong>Start Time: </strong>{new Date(del.startTime).toLocaleTimeString()}</p>
                <p><strong>End Time: </strong>{new Date(del.endTime).toLocaleTimeString()}</p>

                <h4>Orders:</h4>
                <ul>
                  {del.deliveries.map((d, index)=>(
                    <li key = {index}>
                      {d.orderID} - {d.customerName}
                      <button className ="driver-delivery-button"
                        onClick= {() => handleCompleteDelivery(d._id)}
                        disabled= {d.status === "completed"}
                        >
                          {d.status === "completed" ? "Completed" : "Complete"}
                      </button>
                    </li>
                  ))}
                </ul>
            </div>
              ))}
          </div>
          </div>
        )}

        {activeSection === "history" && (
          <div className="section">
            <h2>History</h2>
            <div className="card">
              {completedDelivery.map(del =>(
                <div key = {del._id} className="driver-delivery-card">
                <p><strong>Total Weight: </strong>{del.totalWeight} Kg</p>
                <p><strong>Assign Date: </strong>{new Date(del.assignDate).toLocaleDateString()}</p>
                <p><strong>Start Time: </strong>{new Date(del.startTime).toLocaleTimeString()}</p>
                <p><strong>End Time: </strong>{new Date(del.endTime).toLocaleTimeString()}</p>
                <h4>Orders:</h4>
                <ul>
                  {del.deliveries.map((d, index)=>(
                    <li key = {index}>
                      {d.orderID} - {d.customerName} - {d.status}
                    </li>
                  ))}
                </ul>
            </div>
              ))}
              
            </div>
          </div>
        )}

        {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Update Profile</h2>
                  
                <label>Name:</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                />

                <label>Email:</label>
                <input 
                  type="email" 
                  value={editEmail} 
                  onChange={(e) => setEditEmail(e.target.value)} 
                />

                <label>Phone:</label>
                <input 
                  type="text" 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)} 
                />

                <div className="modal-actions">
                  <button 
                    className="save-btn"
                    onClick={async () => {
                      handleUpdateProfile();
                    }}
                  >
                    Save
                  </button>
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
}
