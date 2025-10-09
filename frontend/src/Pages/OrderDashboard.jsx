// OrderDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { FiHome, FiLogOut, FiUserPlus, FiShoppingBag, FiGift, FiCreditCard } from 'react-icons/fi';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPromocodeModal from "../Components/AddPromocode";
import UpdatePromocode from "../Components/UpdatePromocode";
import "../Css/OrderDashboard.css";

export default function OrderDashboard() {
  const [view, setView] = useState("dashboard");
  const [promocodes, setPromocodes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // empty = all
  const searchTimeoutRef = useRef(null);

  // Status list
  const statusOrder = ["pending", "approved", "ready to assign", "completed", "cancelled"];

  // --- fetchOrders (with q & status support) ---
  const fetchOrders = async (opts = {}) => {
    try {
      setLoadingOrders(true);
      const params = new URLSearchParams();
      if ((opts.q ?? searchTerm)?.trim()) params.append("q", (opts.q ?? searchTerm).trim());
      if ((opts.status ?? filterStatus)?.trim()) params.append("status", (opts.status ?? filterStatus).trim());

      const url = `http://localhost:8070/api/orders${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch payments & promos
  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      const res = await fetch("http://localhost:8070/api/payment");
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      toast.error("Failed to fetch payments");
    } finally {
      setLoadingPayments(false);
    }
  };

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

  // Approve / Cancel handlers
  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:8070/api/orders/${id}/approve`, { method: "PUT" });
      toast.success("Order approved!");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to approve order");
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await fetch(`http://localhost:8070/api/orders/${id}/cancel`, { method: "PUT" });
      toast.success("Order cancelled!");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to cancel order");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this promocode?")) {
      await fetch(`http://localhost:8070/api/promocode/delete/${id}`, { method: "DELETE" });
      fetchPromocodes();
    }
  };

  useEffect(() => {
    if (view === "promo") fetchPromocodes();
    if (view === "order" || view === "dashboard") fetchOrders();
    if (view === "payments") fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      if (view === "order" || view === "dashboard") {
        fetchOrders({ q: searchTerm, status: filterStatus });
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterStatus]);

  const handleSignOut = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Signed out successfully!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  // --- Quick Insights calculations (unique part) ---
  const getMostRecentOrder = () => {
    if (!orders || orders.length === 0) return null;
    const sorted = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted[0];
  };

  const getHighestValueOrder = () => {
    if (!orders || orders.length === 0) return null;
    const sorted = [...orders].sort((a,b) => (b.total || 0) - (a.total || 0));
    return sorted[0];
  };

  const getOldestPending = () => {
    if (!orders || orders.length === 0) return null;
    const pending = orders.filter(o => (o.status || "").toLowerCase() === "pending");
    if (pending.length === 0) return null;
    const sorted = pending.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    return sorted[0];
  };

  const mostRecent = getMostRecentOrder();
  const highestValue = getHighestValueOrder();
  const oldestPending = getOldestPending();

  // Click "View" => focus search to that order number (or filter status)
  const viewOrder = (order) => {
    if (!order) return;
    // set search to orderNumber and fetch
    setSearchTerm(order.orderNumber || "");
    setFilterStatus("");
    fetchOrders({ q: order.orderNumber || "", status: "" });
    setView("order");
  };

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
            <li className={view === 'order' ? 'active' : ''} onClick={() => setView('order')}><FiShoppingBag /> Orders</li>
            <li
              className={view === 'promo' ? 'active' : ''}
              onClick={() => { setView('promo'); setShowAddForm(false); setEditingPromo(null); }}
            >
              <FiGift /> PromoCodes
            </li>
            <li className={view === 'payments' ? 'active' : ''} onClick={() => setView('payments')}><FiCreditCard /> Payments</li>
          </ul>

          <div className="order-sidebar-footer">
            <button className="signout-btn" onClick={handleSignOut}>
              <FiLogOut /> Sign Out
            </button>
          </div>
        </aside>

        <main className='order-main'>
          {view === 'dashboard' && (
            <div className='manage-order-dashboard-view'>
              <h2 className="manage-order-dashboard-title">Welcome to the Order Dashboard</h2>

              <div className="manage-order-stats-row">
                <div className="manage-order-stat-box box-blue">
                  <h3>Total Orders</h3>
                  <span>{orders.length}</span>
                  <p>Total number of orders</p>
                </div>

                <div className="manage-order-stat-box box-green">
                  <h3>Approved Orders</h3>
                  <span>{orders.filter(o => (o.status || "").toLowerCase() === "approved").length}</span>
                  <p>Orders approved</p>
                </div>

                <div className="manage-order-stat-box box-yellow">
                  <h3>Pending Orders</h3>
                  <span>{orders.filter(o => (o.status || "").toLowerCase() === "pending").length}</span>
                  <p>Orders waiting approval</p>
                </div>

                <div className="manage-order-stat-box box-purple">
                  <h3>Cancelled Orders</h3>
                  <span>{orders.filter(o => (o.status || "").toLowerCase() === "cancelled").length}</span>
                  <p>Orders cancelled</p>
                </div>
              </div>

              {/* --- UNIQUE PART: Quick Insights --- */}
              <div className="quick-insights" style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div className="insight-card" style={{ flex: "1 1 300px", padding: 12, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                  <h4>Most Recent Order</h4>
                  {mostRecent ? (
                    <>
                      <p><strong>{mostRecent.orderNumber}</strong></p>
                      <p>{mostRecent.customerName} • Rs. {mostRecent.total}</p>
                      <p style={{ fontSize: 12, color: "#666" }}>{new Date(mostRecent.createdAt).toLocaleString()}</p>
                      <button className="btn" onClick={() => viewOrder(mostRecent)}>View</button>
                    </>
                  ) : <p>No orders</p>}
                </div>

                <div className="insight-card" style={{ flex: "1 1 300px", padding: 12, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                  <h4>Highest Value Order</h4>
                  {highestValue ? (
                    <>
                      <p><strong>{highestValue.orderNumber}</strong></p>
                      <p>{highestValue.customerName} • Rs. {highestValue.total}</p>
                      <p style={{ fontSize: 12, color: "#666" }}>{highestValue.status}</p>
                      <button className="btn" onClick={() => viewOrder(highestValue)}>View</button>
                    </>
                  ) : <p>No orders</p>}
                </div>

                <div className="insight-card" style={{ flex: "1 1 300px", padding: 12, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                  <h4>Oldest Pending Order</h4>
                  {oldestPending ? (
                    <>
                      <p><strong>{oldestPending.orderNumber}</strong></p>
                      <p>{oldestPending.customerName} • Rs. {oldestPending.total}</p>
                      <p style={{ fontSize: 12, color: "#666" }}>{new Date(oldestPending.createdAt).toLocaleString()}</p>
                      <button className="btn" onClick={() => viewOrder(oldestPending)}>View</button>
                    </>
                  ) : <p>No pending orders</p>}
                </div>
              </div>
            </div>
          )}

          {view === 'order' && (
            <section className="order-section">
              <div className="order-topbar">
                <h2>All Orders</h2>

                <div className="order-search-controls">
                  <input
                    type="text"
                    placeholder="Search by customer name or order number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {statusOrder.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                  <button className="btn" onClick={() => fetchOrders({ q: searchTerm, status: filterStatus })}>Search</button>
                  <button className="btn" onClick={() => { setSearchTerm(""); setFilterStatus(""); fetchOrders({ q: "", status: "" }); }}>Clear</button>
                  <button className="btn" onClick={() => fetchOrders()}>Refresh</button>
                </div>
              </div>

              {loadingOrders ? <p>Loading orders...</p> : (
                <>
                  {statusOrder.map(status => {
                    const filteredOrders = orders.filter(o => (o.status || "").toLowerCase() === status);
                    if (filteredOrders.length === 0) return null;

                    return (
                      <div key={status} className="order-status-section">
                        <h3 className={`status-header ${status.replace(/\s+/g, "-")}`}>
                          {status.toUpperCase()}
                        </h3>

                        <div className="order-cards-wrapper">
                          {filteredOrders.map(order => (
                            <div key={order._id} className="manage-order-card">
                              <div className="order-card-header">
                                <span className="order-number">{order.orderNumber}</span>
                                <span className={`order-status ${((order.status || "")).toLowerCase().replace(/\s+/g, "-")}`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="order-details">
                                <p><strong>Customer:</strong> {order.customerName}</p>
                                <p><strong>Phone:</strong> {order.phone}</p>
                                <p><strong>Address:</strong> {order.address}</p>
                                <p><strong>Priority:</strong> {order.priority}</p>
                                <p><strong>Total:</strong> Rs. {order.total}</p>
                              </div>
                              <div className="order-items">
                                <strong>Items:</strong>
                                {Array.isArray(order.items) && order.items.map((it, idx) => (
                                  <p key={idx}>{it.product} × {it.quantity} = Rs. {it.price}</p>
                                ))}
                              </div>

                              {(order.status || "").toLowerCase() === "pending" && (
                                <div className="order-actions-unique">
                                  <button className="ord-btn approve" onClick={() => handleApprove(order._id)}>Approve</button>
                                  <button className="ord-btn cancel" onClick={() => handleCancel(order._id)}>Cancel</button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </section>
          )}

          {view === 'payments' && (
            <section className="order-section">
              <div className="order-topbar">
                <h2>Payments</h2>
                <button className="btn" onClick={fetchPayments}>Refresh</button>
              </div>

              {loadingPayments ? (
                <p>Loading payments...</p>
              ) : (
                <div className="order-cards-wrapper">
                  {payments.length > 0 ? payments.map(payment => (
                    <div key={payment._id} className="manage-order-card">
                      <div className="order-card-header">
                        <span className="order-number">{payment.paymentId}</span>
                        <span className={`order-status ${payment.paymentMode ? payment.paymentMode.toLowerCase() : ""}`}>
                          {payment.paymentMode}
                        </span>
                      </div>
                      <div className="order-details">
                        <p><strong>Name:</strong> {payment.name}</p>
                        <p><strong>Email:</strong> {payment.email}</p>
                        <p><strong>Phone:</strong> {payment.phone}</p>
                        <p><strong>Address:</strong> {payment.address}</p>
                        <p><strong>Total:</strong> Rs. {payment.total}</p>
                        {payment.coupon && <p><strong>Coupon:</strong> {payment.coupon}</p>}
                      </div>
                      <div className="order-items">
                        <strong>Products:</strong>
                        {Array.isArray(payment.products) && payment.products.map((item, idx) => (
                          <p key={idx}>
                            {item.productInfo?.name} × {item.quantity} = Rs. {item.productInfo?.price}
                          </p>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <p>No payments available</p>
                  )}
                </div>
              )}
            </section>
          )}

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

              <div className="promo-cards-wrapper">
                {promocodes.length > 0 ? (
                  promocodes.map((promo) => (
                    <div key={promo._id} className="promo-card">
                      <div className="promo-card-header">
                        <span className="promo-code">{promo.code}</span>
                        <div className="promo-actions">
                          <button className="btn-small" onClick={() => setEditingPromo(promo)}>Edit</button>
                          <button className="btn-small danger" onClick={() => handleDelete(promo._id)}>Delete</button>
                        </div>
                      </div>
                      <div className="promo-details">
                        <p>Type: <strong>{promo.discountType}</strong></p>
                        <p>Value: <strong>{promo.discountType === "percentage" ? `${promo.discountValue}%` : `Rs. ${promo.discountValue}`}</strong></p>
                        <p>Expiry: <strong>{promo.expiryDate ? new Date(promo.expiryDate).toLocaleDateString() : "N/A"}</strong></p>
                        <p>Usage Limit: <strong>{promo.usageLimit}</strong></p>
                        <p>Used: <strong>{promo.usedCount}</strong></p>
                      </div>
                    </div>
                  ))
                ) : <p>No promocodes available</p>}
              </div>

              {showAddForm && (
                <div className="add-promo-modal-overlay">
                  <div className="add-promo-modal">
                    <button className="close-btn" onClick={() => setShowAddForm(false)}>×</button>
                    <AddPromocodeModal fetchPromocodes={fetchPromocodes} onClose={() => setShowAddForm(false)} />
                  </div>
                </div>
              )}

              {editingPromo && (
                <div className="promo-update-modal-overlay">
                  <div className="promo-update-modal">
                    <button className="close-btn" onClick={() => setEditingPromo(null)}>×</button>
                    <UpdatePromocode
                      editingPromo={editingPromo}
                      fetchPromocodes={fetchPromocodes}
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
