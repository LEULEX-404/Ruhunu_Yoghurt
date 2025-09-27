// OrderDashboard.jsx
import React, { useEffect, useState } from "react";
import { FiUserX, FiHome, FiLogOut, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPromocodeModal from "../Components/AddPromocode";
import PromocodeList from "../Components/PromocodeList";
import UpdatePromocode from "../Components/UpdatePromocode";
import "../Css/OrderDashboard.css";

export default function OrderDashboard() {
  const [view, setView] = useState("dashboard");
  const [promocodes, setPromocodes] = useState([]);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch all promocodes
  const fetchPromocodes = async () => {
    try {
      setLoadingPromos(true);
      const res = await fetch("http://localhost:8070/api/promocode");
      const data = await res.json();
      setPromocodes(Array.isArray(data) ? data : data.promos || []);
    } catch (err) {
      console.error("Failed to fetch promocodes:", err);
    } finally {
      setLoadingPromos(false);
    }
  };

  useEffect(() => {
    if (view === "promo") fetchPromocodes();
  }, [view]);

  return (
    <div className='order-dashboard-container'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className='order-wrapper'>
        <aside className="order-sidebar">
          <div className="order-sidebar-header">
            <h2>Order Management</h2>
            <div className='order-manager-card'>
              <img
                src='https://cdn-icons-png.flaticon.com/512/3237/3237472.png'
                alt='Profile'
                className='profile-avatar'
              />
              <div>
                <h4 className="order-manager-name"><p>Order Manager</p></h4>
                <p className="order-manager-role">OM-01</p>
                <p className="order-manager-role">Lasiru Hasaranga</p>
                <p className="order-manager-role">lasiru@gmail.com</p>
              </div>
            </div>
          </div>

          <ul className="order-sidebar-menu">
            <li className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}><FiHome /> Dashboard</li>
            <li className={view === 'order' ? 'active' : ''} onClick={() => setView('order')}><FiUserPlus /> Orders</li>
            <li
              className={view === 'promo' ? 'active' : ''}
              onClick={() => { setView('promo'); setShowAddForm(false); setEditingPromo(null); }}
            >
              <FiUserX /> PromoCodes
            </li>
            <li className={view === 'payments' ? 'active' : ''} onClick={() => setView('payments')}><FiUserCheck /> Payments</li>
          </ul>

          <div className="order-sidebar-footer">
            <button className="signout-btn">
              <FiLogOut /> Sign Out
            </button>
          </div>
        </aside>

        {/* --- Main content --- */}
        <main className='order-main'>
          {view === 'dashboard' && <div><h2>Dashboard</h2><p>Quick metrics and charts go here.</p></div>}
          {view === 'order' && <div><h2>Orders</h2><p>Order list and management UI placeholder.</p></div>}
          {view === 'payments' && <div><h2>Payments</h2><p>Payments UI placeholder.</p></div>}

          {view === 'promo' && (
            <section className="promo-section">
              <div className="promo-topbar">
                <h2>Promocodes</h2>
                <div className="promo-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => { setShowAddForm(true); setEditingPromo(null); }}
                  >
                    <FiUserPlus /> Add Promocode
                  </button>
                  <button className="btn" onClick={fetchPromocodes}>Refresh</button>
                </div>
              </div>

              {/* Promo List only */}
              <div className="promo-list-area">
                <PromocodeList
                  promocodes={promocodes}
                  fetchPromocodes={fetchPromocodes}
                  setEditingPromo={(p) => { setEditingPromo(p); setShowAddForm(false); }}
                />
              </div>

              {/* Add Modal */}
              {showAddForm && (
                <AddPromocodeModal
                  fetchPromocodes={() => { fetchPromocodes(); }}
                  onClose={() => setShowAddForm(false)}
                />
              )}

              {/* Update Modal */}
              {editingPromo && (
                <div className="promo-update-modal-overlay">
                  <div className="promo-update-modal">
                    <UpdatePromocode
                      editingPromo={editingPromo}
                      fetchPromocodes={() => { fetchPromocodes(); }}
                      cancelEdit={() => setEditingPromo(null)}
                    />
                  </div>
                </div>
              )}

              {loadingPromos && <p>Loading promocodes...</p>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
