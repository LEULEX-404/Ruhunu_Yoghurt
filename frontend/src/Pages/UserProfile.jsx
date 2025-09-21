import { useEffect, useState } from "react";
import axios from "axios";
import "../Css/Profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <div>Overview Content</div>;
      case "orders":
        return <div>Orders Content</div>;
      case "settings":
        return <div>Settings Content</div>;
      default:
        return null;
    }

  };
  
    const openEditModal = (user) =>{
        setEditUser(user);
        setEditModalOpen(true);
    };

    const closeEditModal = () =>{
        setEditUser(null);
        setEditModalOpen(false);
    };

const handleUpdateUser = async (e) =>{
    e.preventDefault();

    if(!editUser){
        alert("No User selected to Updated!");
        return;
    }
    const userId = editUser?._id || editUser?.id || user?._id || user?.id;

    if (!userId) {
        console.error("User ID is missing");
        return;
      }

    try{
        const res = await axios.put(`http://localhost:8070/api/user/update/${editUser.id}`,
            { name:editUser.name, email:editUser.email, address:editUser.address})

            console.log('User updated:', res.data);

            setUser(res.data.updatedUser || editUser);
        localStorage.setItem("user", JSON.stringify(res.data.updatedUser || editUser));
        
            alert('User updated Successfully', res.data.message);
            closeEditModal();
    }
    catch(error){
        console.error('error updating user:', error);
        alert('Failed to update user');
    }
}

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>
            Joined{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}{" "}
            • <span className="verified">✔ Verified</span>
          </p>
        </div>
        <div className="profile-actions">
          <button onClick = {() => openEditModal(user)} className="edit-btn">Edit Profile</button>
          <button className="settings-btn">Settings</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="card">
          <h3>25</h3>
          <p>Orders Placed</p>
        </div>
        <div className="card">
          <h3>20</h3>
          <p>Total Deliveries</p>
        </div>
        <div className="card">
          <h3>8</h3>
          <p>Wishlist Items</p>
        </div>
        <div className="card">
          <h3>5</h3>
          <p>Reviews Given</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "overview" ? "tab active" : "tab"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "orders" ? "tab active" : "tab"}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={activeTab === "settings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>
      {editModalOpen && (
        <div className = 'modal-overlay'>
            <div className = 'modal-content'>
                <h2>Edit Profile: {editUser?.name}</h2>
                <form onSubmit = {handleUpdateUser}>
                    <div className = 'form-group'>
                        <input
                            type = "text"
                            placeholder="Name"
                            value={editUser?.name || ''}
                            onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                            required
                        />
                        <input
                            type = "email"
                            placeholder="Email"
                            value={editUser?.email || ''}
                            onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                            required
                        />
                        <input
                            type = "text"
                            placeholder="Address"
                            value={editUser?.address || ''}
                            onChange={(e) => setEditUser({...editUser, address: e.target.value})}
                            required
                        />
                    </div>
                    <div className = 'modal-buttons'>
                        <button type='submit' className="submit-btn">Update</button>
                        <button type='button' className="cancel-btn" onClick={closeEditModal}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
      )} 

      {renderContent()}
    </div>
  );
}
