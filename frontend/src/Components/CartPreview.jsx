import React, { useState } from "react";
import axios from "axios";
import "../Css/CartPreview.css";

const API_BASE = "http://localhost:8070";

function CartPreview({ appliedCoupon }) {

  const [cardNumber, setCardNumber] = useState("");
  const [cardcvv, setCardCvv] = useState("");

  const [cart, setCart] = useState(null);
  
  const [err, setErr] = useState("");

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({ pay: false, cod: false });

  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return setErr("User not logged in");
    setErr(""); setLoading(true); setCart(null);

    try {
      const res = await fetch(`${API_BASE}/api/cart/preview/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const json = await res.json();
      setCart(json);
      setShowPreviewModal(true);
    } catch (e) {
      console.error(e);
      setErr("Unable to fetch cart");
    } finally { setLoading(false); }
  };

  const handleCOD = async () => {
    if (!cart?.items?.length) return alert("Cart is empty");
    setActionLoading(prev => ({ ...prev, cod: true }));
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const products = cart.items.map(it => ({
        productInfo: { productId: it._id || it.productId, labelledPrice: it.price, name: it.name, price: it.price, weight: it.weight },
        quantity: it.quantity
      }));
      await axios.post(`${API_BASE}/api/payment/cod/${user.id}`, { products, total: cart.total });
      alert("COD Order placed successfully.");
      setShowPreviewModal(false);
    } catch (err) { console.error(err); alert("COD Order failed!"); }
    finally { setActionLoading(prev => ({ ...prev, cod: false })); }
  };

  const openPayModal = () => { setShowPreviewModal(false); setShowPayModal(true); };

  const handlePayNow = async () => {
    if (!cart?.items?.length) return alert("Cart is empty");
    setActionLoading(prev => ({ ...prev, pay: true }));
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const products = cart.items.map(it => ({
        productInfo: { productId: it._id || it.productId, labelledPrice: it.price, name: it.name, price: it.price, weight: it.weight },
        quantity: it.quantity
      }));
      await axios.post(`${API_BASE}/api/payment/paynow/${user.id}`, {
        cardNumber, cardcvv, products, total: cart.total, coupon: appliedCoupon || null
      });
      alert("Payment success! Order created.");
      setShowPayModal(false);
    } catch (err) { console.error(err.response?.data || err); alert("Payment failed!"); }
    finally { setActionLoading(prev => ({ ...prev, pay: false })); }
  };

  return (
    <div className="cart-preview-page">
      <h2>Cart Preview</h2>
      <button onClick={fetchCart} disabled={loading}>{loading ? "Loading..." : "Preview My Cart"}</button>
      {err && <div className="error">{err}</div>}

      {showPreviewModal && cart && (
        <div className="modal-backdrop" onClick={() => setShowPreviewModal(false)}>
          <div className="modal preview-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cart Preview</h3>
            <button className="close" onClick={() => setShowPreviewModal(false)}>✕</button>

            <div className="modal-content">
              {cart.items.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                cart.items.map((it, idx) => (
                  <div key={idx} className="item-row">
                    <span>{it.name} ({it.quantity} × Rs.{it.price})</span>
                    <span>Rs.{it.subtotal}</span>
                  </div>
                ))
              )}
              <div className="total-row">
                <strong>Total:</strong> Rs.{cart.total}
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleCOD} disabled={actionLoading.cod}>{actionLoading.cod ? "Placing..." : "COD"}</button>
              <button onClick={openPayModal}>Pay Now</button>
            </div>
          </div>
        </div>
      )}

      {showPayModal && (
        <div className="modal-backdrop" onClick={() => setShowPayModal(false)}>
          <div className="modal pay-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Pay Now</h3>
            <button className="close" onClick={() => setShowPayModal(false)}>✕</button>

            <div className="modal-content">
              <input type="text" placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
              <input type="password" placeholder="CVV" value={cardcvv} onChange={e => setCardCvv(e.target.value)} />
              <div className="total-row">
                <strong>Total:</strong> Rs.{cart?.total ?? 0}
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowPayModal(false)}>Cancel</button>
              <button onClick={handlePayNow} disabled={actionLoading.pay}>{actionLoading.pay ? "Processing..." : "Pay Now"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPreview;
