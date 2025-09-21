import { useEffect, useState } from "react";
import "../Css/Profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);

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

  // ✅ Render fallback if user is not loaded yet
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
          <button className="edit-btn">Edit Profile</button>
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

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
}
