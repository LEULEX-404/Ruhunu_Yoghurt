import React, { useState } from "react";
import "../Css/CartPreview.css";

const API_BASE = "http://localhost:8070";

function CartPreview() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({ pay: false, cod: false });

  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      setErr("User not logged in");
      return;
    }
    setErr("");
    setLoading(true);
    setCart(null);
    try {
      const res = await fetch(`${API_BASE}/api/cart/preview/${user.id}`);
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

const handlePayNow = () => {
  if (!cart) return;

  const paymentData = {
    cartId: cart.id,
    amount: cart.total,
    discountApplied: cart.discountApplied,
    promocode: cart.promocode,
  };

  sessionStorage.setItem("paymentData", JSON.stringify(paymentData));

  window.location.href = "/payment";
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
      <button onClick={fetchCart} disabled={loading}>
        {loading ? "Loading..." : "Preview My Cart"}
      </button>

      {err && <div className="error">{err}</div>}

      {showModal && cart && (
        <div className="cp-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-header">
              <h3>Cart Preview</h3>
              <button className="close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="cp-body">
              <div className="row"><strong>Customer:</strong> {cart.customer}</div>

              <div className="items">
                {(!cart.items || cart.items.length === 0) ? (
                  <div className="empty">Cart is empty</div>
                ) : (
                  cart.items.map((it, idx) => (
                    <div className="item" key={idx}>
                      <div>
                        <div className="iname">{it.name}</div>
                        <div className="imeta">
                          Qty: {it.quantity} × Rs.{it.price} | Weight: {it.weight}g
                        </div>
                      </div>
                      <div className="isub">Rs.{it.subtotal}</div>
                    </div>
                  ))
                )}
              </div>

              {cart.discountApplied && (
                <div className="discount">
                  Discount Applied: -Rs.{cart.discountApplied.discount} (
                  {cart.discountApplied.type === "percentage"
                    ? cart.discountApplied.value + "%"
                    : "Fixed"}
                  )
                </div>
              )}

              {cart.promoMessage && (
                <div className="promo invalid">{cart.promoMessage}</div>
              )}

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
