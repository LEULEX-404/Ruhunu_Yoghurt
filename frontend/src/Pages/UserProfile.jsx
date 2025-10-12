import { useEffect, useState } from "react";
import axios from "axios";
import "../Css/Profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const openEditModal = (user) => {
    setEditUser(user);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditUser(null);
    setEditModalOpen(false);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!editUser) {
      alert("No User selected to Update!");
      return;
    }

    const userId = editUser?._id || editUser?.id || user?._id || user?.id;

    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8070/api/user/update/${userId}`,
        {
          name: editUser.name,
          email: editUser.email,
          address: editUser.address,
        }
      );

      const updatedUser = res.data.updatedUser || editUser;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("User updated Successfully");
      closeEditModal();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="user-profile-page">
        {/* Banner */}
        <div className="user-banner"></div>

        {/* Profile Card */}
        <div className="user-card">
          <div className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className="user-meta">
              Joined{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}{" "}
              • <span className="user-verified">✔ Verified</span>
            </span>
          </div>
          <div className="user-actions">
            <button
              onClick={() => openEditModal(user)}
              className="user-btn user-btn-primary"
            >
              Edit Profile
            </button>
            <button className="user-btn user-btn-secondary">Settings</button>
          </div>
        </div>

        {/* Stats */}
        <div className="user-stats-grid">
          <div className="user-stat-card">
            <h3>25</h3>
            <p>Orders Placed</p>
          </div>
          <div className="user-stat-card">
            <h3>20</h3>
            <p>Total Deliveries</p>
          </div>
          <div className="user-stat-card">
            <h3>8</h3>
            <p>Wishlist Items</p>
          </div>
          <div className="user-stat-card">
            <h3>5</h3>
            <p>Reviews Given</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="user-tabs">
          <button
            className={activeTab === "overview" ? "user-tab active" : "user-tab"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={activeTab === "orders" ? "user-tab active" : "user-tab"}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={activeTab === "settings" ? "user-tab active" : "user-tab"}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="user-tab-content">
          {activeTab === "overview" && <div>Overview Content</div>}
          {activeTab === "orders" && <div>Orders Content</div>}
          {activeTab === "settings" && <div>Settings Content</div>}
        </div>

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="user-modal-overlay">
            <div className="user-modal">
              <h2>Edit Profile</h2>
              <form onSubmit={handleUpdateUser}>
                <div className="user-form-group">
                  <input
                    type="text"
                    placeholder="Name"
                    value={editUser?.name || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={editUser?.email || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={editUser?.address || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, address: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="user-modal-buttons">
                  <button type="submit" className="user-btn user-btn-primary">
                    Update
                  </button>
                  <button
                    type="button"
                    className="user-btn user-btn-secondary"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
