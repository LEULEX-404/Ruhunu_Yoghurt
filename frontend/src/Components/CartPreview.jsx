import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../Css/CartPreview.css";
import Header from "./header";
import { BadgePercent, Banknote, CreditCard, Loader2, PackageCheck, ReceiptText, X } from "lucide-react";
import { getProductImage } from "../utils/productImage";

const API_BASE = "http://localhost:8070";

function CartPreview({ appliedCoupon, modal = false, open = true, onClose, onOrderComplete }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardcvv, setCardCvv] = useState("");
  const [cart, setCart] = useState(null);
  const [err, setErr] = useState("");
  const [showPayPanel, setShowPayPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({ pay: false, cod: false });
  const [promoInput, setPromoInput] = useState("");
  const [promoApplying, setPromoApplying] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");

  const fetchCart = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      setErr("User not logged in");
      toast.error("Please login before checkout.");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/cart/preview/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const json = await res.json();
      setCart(json);
      setPromoMessage(json.promoMessage || "");
    } catch (e) {
      console.error(e);
      setErr("Unable to fetch cart");
      toast.error("Could not load checkout preview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchCart();
  }, [fetchCart, open]);

  const handleApplyPromo = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return toast.error("Please login before applying a promo code.");
    if (!promoInput || promoInput.trim().length === 0) {
      setPromoMessage("Enter a promo code");
      return toast.error("Enter a promo code first.");
    }

    setPromoApplying(true);
    setPromoMessage("");
    try {
      const res = await axios.post(`${API_BASE}/api/cart/apply-promocode/${user.id}`, {
        code: promoInput.trim()
      });

      const data = res.data;
      if (data.error) {
        setPromoMessage(data.error);
        toast.error(data.error);
      } else {
        setCart(prev => ({ ...prev, total: data.total, discountApplied: data.discountApplied, promocode: data.promocode }));
        setPromoMessage("Promocode applied");
        toast.success("Promo code applied.");
      }
    } catch (err) {
      console.error(err);
      setPromoMessage("Failed to apply promocode");
      toast.error(err.response?.data?.error || "Promo code could not be applied.");
    } finally {
      setPromoApplying(false);
    }
  };

  const cartProducts = cart?.items?.map(it => ({
    productInfo: { productId: it.productId, labelledPrice: it.price, name: it.name, price: it.price, weight: it.weight },
    quantity: it.quantity
  })) || [];

  const finishOrder = () => {
    setCart(null);
    setShowPayPanel(false);
    onOrderComplete?.();
    onClose?.();
  };

  const handleCOD = async () => {
    if (!cart?.items?.length) return toast.error("Your cart is empty.");
    setActionLoading(prev => ({ ...prev, cod: true }));
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(`${API_BASE}/api/payment/cod/${user.id}`, {
        products: cartProducts,
        total: cart.total,
        coupon: cart.promocode || null
      });
      toast.success("COD order placed successfully.");
      finishOrder();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "COD order failed.");
    } finally {
      setActionLoading(prev => ({ ...prev, cod: false }));
    }
  };

  const handlePayNow = async () => {
    if (!cart?.items?.length) return toast.error("Your cart is empty.");
    if (!cardNumber.trim() || !cardcvv.trim()) return toast.error("Enter card number and CVV.");

    setActionLoading(prev => ({ ...prev, pay: true }));
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(`${API_BASE}/api/payment/paynow/${user.id}`, {
        cardNumber,
        cardcvv,
        products: cartProducts,
        total: cart.total,
        coupon: cart.promocode || appliedCoupon || null
      });
      toast.success("Payment successful. Order created.");
      finishOrder();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.error || "Payment failed. Please check the details.");
    } finally {
      setActionLoading(prev => ({ ...prev, pay: false }));
    }
  };

  if (modal && !open) return null;

  const content = (
    <div className={modal ? "cart-preview-page modal-mode" : "cart-preview-page"}>
      <section className="preview-heading">
        <div>
          <span><PackageCheck size={17} /> Final order check</span>
          <h1>Preview your cold-pack order</h1>
        </div>
        <div className="preview-heading-actions">
          <button onClick={fetchCart} disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : <ReceiptText size={18} />}
            {loading ? "Refreshing" : "Refresh"}
          </button>
          {modal && (
            <button className="modal-close-button" onClick={onClose} aria-label="Close checkout">
              <X size={18} />
            </button>
          )}
        </div>
      </section>

      {err && <div className="preview-error">{err}</div>}

      {!cart && !loading ? (
        <div className="preview-empty">No preview available. Your cart may be empty.</div>
      ) : cart && (
        <div className="preview-layout">
          <section className="preview-items">
            {cart.items.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              cart.items.map((it, idx) => (
                <div key={idx} className="preview-item-row">
                  <img src={getProductImage({ name: it.name })} alt={it.name} />
                  <div>
                    <strong>{it.name}</strong>
                    <span>{it.quantity} x Rs {Number(it.price).toFixed(2)}</span>
                  </div>
                  <b>Rs {Number(it.subtotal).toFixed(2)}</b>
                </div>
              ))
            )}
          </section>

          <aside className="preview-summary">
            <div className="promo-box">
              <label><BadgePercent size={16} /> Promo code</label>
              <div>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoInput}
                  onChange={e => setPromoInput(e.target.value)}
                  disabled={promoApplying}
                />
                <button onClick={handleApplyPromo} disabled={promoApplying}>
                  {promoApplying ? "Applying" : "Apply"}
                </button>
              </div>
              {promoMessage && <p className="promo-message">{promoMessage}</p>}
            </div>

            {cart.discountApplied && (
              <div className="discount-row">
                <strong>Discount</strong>
                <span>
                  {cart.discountApplied.type === "percentage" ? `${cart.discountApplied.value}%` : `Rs ${cart.discountApplied.value}`}
                </span>
              </div>
            )}

            <div className="total-row">
              <span>Total</span>
              <strong>Rs {Number(cart.total || 0).toFixed(2)}</strong>
            </div>

            <div className="preview-actions">
              <button onClick={handleCOD} disabled={actionLoading.cod}>
                <Banknote size={18} /> {actionLoading.cod ? "Placing" : "Cash on Delivery"}
              </button>
              <button onClick={() => setShowPayPanel(!showPayPanel)}>
                <CreditCard size={18} /> Card Payment
              </button>
            </div>

            {showPayPanel && (
              <div className="pay-panel">
                <div className="card-shell">
                  <span>Ruhunu Pay</span>
                  <strong>{cardNumber ? cardNumber.replace(/\d(?=\d{4})/g, "*") : "**** **** **** 0000"}</strong>
                  <small>Secure card checkout</small>
                </div>
                <input type="text" placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                <input type="password" placeholder="CVV" value={cardcvv} onChange={e => setCardCvv(e.target.value)} />
                <button onClick={handlePayNow} disabled={actionLoading.pay}>
                  {actionLoading.pay ? "Processing" : "Pay Now"}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );

  if (modal) {
    return (
      <div className="checkout-modal-backdrop" onMouseDown={onClose}>
        <div className="checkout-modal" onMouseDown={(event) => event.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {content}
    </>
  );
}

export default CartPreview;
