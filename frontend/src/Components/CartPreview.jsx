import React, { useState } from "react";
import "../Css/CartPreview.css";

const API_BASE = "http://localhost:8070";

function CartPreview() {
    
  const [cartId, setCartId] = useState("");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({ pay: false, cod: false });

  const fetchCart = async () => {
    const id = cartId.trim();
    if (!id) {
      setErr("Enter Cart ObjectId");
      return;
    }
    setErr("");
    setLoading(true);
    setCart(null);
    try {
      const res = await fetch(`${API_BASE}/api/cart/preview/${id}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `Server returned ${res.status}`);
      }
      const json = await res.json();
      setCart(json);
      setShowModal(true);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Unable to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!cart) return;
    if (!window.confirm("Proceed to pay now for this cart?")) return;
    setActionLoading(prev => ({ ...prev, pay: true }));
    try {
      const res = await fetch(`${API_BASE}/api/cart/${cart.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Payment failed");
      alert(json.message || "Payment successful");
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert(e.message || "Payment error");
    } finally {
      setActionLoading(prev => ({ ...prev, pay: false }));
    }
  };

  const handleCOD = async () => {
    if (!cart) return;
    if (!window.confirm("Place order as Cash on Delivery?")) return;
    setActionLoading(prev => ({ ...prev, cod: true }));
    try {
      const res = await fetch(`${API_BASE}/api/cart/${cart.id}/cod`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "COD failed");
      alert(json.message || "Order placed (COD)");
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert(e.message || "COD error");
    } finally {
      setActionLoading(prev => ({ ...prev, cod: false }));
    }
  };

  return (
    <div className="cart-preview-page">
      <h2>Cart Preview</h2>

      <div className="input-row">
        <input
          type="text"
          placeholder="Enter Cart ObjectId"
          value={cartId}
          onChange={(e) => setCartId(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") fetchCart(); }}
        />
        <button onClick={fetchCart} disabled={loading}>
          {loading ? "Loading..." : "Preview"}
        </button>
      </div>

      {err && <div className="error">{err}</div>}

      <div className="hint">
        Paste an existing Cart ObjectId from your DB and click Preview. Modal will show items, total and two actions.
      </div>

      {/* Modal */}
      {showModal && cart && (
        <div className="cp-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-header">
              <h3>Cart Preview</h3>
              <button className="close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="cp-body">
              <div className="row"><strong>Cart ID:</strong> {cart.id}</div>
              <div className="row"><strong>Customer:</strong> {cart.customerId ?? "N/A"}</div>

              <div className="items">
                {(!cart.items || cart.items.length === 0) ? (
                  <div className="empty">Cart is empty</div>
                ) : (
                  cart.items.map((it, idx) => (
                    <div className="item" key={idx}>
                      <div>
                        <div className="iname">{it.name || it.productId}</div>
                        <div className="imeta">Qty: {it.quantity} × Rs.{it.price}</div>
                      </div>
                      <div className="isub">Rs.{it.subtotal}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="total-row">
                <div><strong>Total</strong></div>
                <div className="total-amount">Rs. {cart.total ?? 0}</div>
              </div>

              {cart.promocode && <div className="promo">Promocode: {cart.promocode}</div>}
            </div>

            <div className="cp-actions">
              <button className="btn ghost" onClick={() => setShowModal(false)}>Close</button>
              <button
                className="btn"
                onClick={handleCOD}
                disabled={actionLoading.cod}
              >
                {actionLoading.cod ? "Placing..." : "COD"}
              </button>
              <button
                className="btn primary"
                onClick={handlePayNow}
                disabled={actionLoading.pay}
              >
                {actionLoading.pay ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPreview;
