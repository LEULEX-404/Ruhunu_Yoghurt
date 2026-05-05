import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../../Css/payment.css";
import Header from "../../Components/header";
import CustomerFooter from "../../Components/CustomerFooter";
import { BadgePercent, Banknote, CreditCard, Loader2, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import { getProductImage, handleProductImageError } from "../../utils/productImage";

const API_BASE = "http://localhost:8070";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const product = location.state?.product;
  const checkoutType = product ? "product" : "cart";

  const [cartPreview, setCartPreview] = useState(null);
  const [cartLoading, setCartLoading] = useState(checkoutType === "cart");
  const [cartError, setCartError] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoApplying, setPromoApplying] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    paymentMode: "COD",
    cardNumber: "",
    cardcvv: "",
  });

  const fetchCartPreview = useCallback(async () => {
    if (!user?.id) {
      setCartLoading(false);
      setCartError("Please login before opening checkout.");
      return;
    }

    setCartLoading(true);
    setCartError("");

    try {
      const res = await axios.get(`${API_BASE}/api/cart/preview/${user.id}`);
      setCartPreview(res.data);
      setPromoMessage(res.data?.promoMessage || "");
    } catch (error) {
      console.error(error);
      setCartError("Could not load your cart checkout.");
      toast.error("Could not load checkout details.");
    } finally {
      setCartLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (checkoutType === "cart") fetchCartPreview();
  }, [checkoutType, fetchCartPreview]);

  const orderItems = useMemo(() => {
    if (checkoutType === "cart") {
      return (cartPreview?.items || []).map((item) => ({
        key: item.productId || item.name,
        name: item.name,
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        subtotal: Number(item.subtotal || Number(item.price || 0) * Number(item.quantity || 0)),
        product: { name: item.name, productId: item.productId, weight: item.weight },
      }));
    }

    const quantity = Number(product.qty || 1);
    const unitPrice =
      product.price && product.price > 0 && Number(product.labelledPrice || 0) > Number(product.price)
        ? Number(product.price)
        : Number(product.labelledPrice || product.price || 0);

    return [{
      key: product.productId || product.name,
      name: product.name,
      quantity,
      price: unitPrice,
      subtotal: unitPrice * quantity,
      product,
    }];
  }, [cartPreview, checkoutType, product]);

  const total = checkoutType === "cart"
    ? Number(cartPreview?.total || 0)
    : orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const paymentProducts = useMemo(() => {
    if (checkoutType === "cart") {
      return (cartPreview?.items || []).map((item) => ({
        productInfo: {
          productId: item.productId,
          labelledPrice: Number(item.price || 0),
          name: item.name,
          price: Number(item.price || 0),
          weight: item.weight || 0,
        },
        quantity: Number(item.quantity || 0),
      }));
    }

    return [{
      productInfo: {
        productId: product._id || product.productId,
        labelledPrice: Number(product.labelledPrice || product.price || 0),
        name: product.name,
        price: Number(product.price > 0 ? product.price : product.labelledPrice || 0),
        weight: product.weight || 0,
      },
      quantity: Number(product.qty || 1),
    }];
  }, [cartPreview, checkoutType, product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = async () => {
    if (checkoutType !== "cart") return;
    if (!user?.id) return toast.error("Please login before applying a promo code.");
    if (!promoInput.trim()) {
      setPromoMessage("Enter a promo code");
      return toast.error("Enter a promo code first.");
    }

    setPromoApplying(true);
    setPromoMessage("");

    try {
      const res = await axios.post(`${API_BASE}/api/cart/apply-promocode/${user.id}`, {
        code: promoInput.trim(),
      });

      if (res.data?.error) {
        setPromoMessage(res.data.error);
        toast.error(res.data.error);
      } else {
        setCartPreview((prev) => ({
          ...prev,
          total: res.data.total,
          discountApplied: res.data.discountApplied,
          promocode: res.data.promocode,
        }));
        setPromoMessage("Promo code applied");
        toast.success("Promo code applied.");
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || "Promo code could not be applied.";
      setPromoMessage(message);
      toast.error(message);
    } finally {
      setPromoApplying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) return toast.error("Please login before checkout.");
    if (!paymentProducts.length || total <= 0) return toast.error("No payable items found.");
    if (formData.paymentMode === "Card" && (!formData.cardNumber.trim() || !formData.cardcvv.trim())) {
      return toast.error("Enter card number and CVV.");
    }

    setSubmitting(true);

    try {
      const endpoint = formData.paymentMode === "COD"
        ? `${API_BASE}/api/payment/cod/${user.id}`
        : `${API_BASE}/api/payment/paynow/${user.id}`;

      await axios.post(
        endpoint,
        {
          cardNumber: formData.cardNumber,
          cardcvv: formData.cardcvv,
          products: paymentProducts,
          total,
          coupon: cartPreview?.promocode || null,
          customerDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success(formData.paymentMode === "COD" ? "COD order placed successfully." : "Payment successful. Order created.");
      navigate("/products");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const heroImageProduct = orderItems[0]?.product || product || { name: "Ruhunu Yoghurt" };
  const isEmptyCart = checkoutType === "cart" && !cartLoading && orderItems.length === 0;

  return (
    <>
      <Header />
      <div className="payment-page">
        <div className="payment-container">
          <section className="payment-summary">
            <div>
              <span className="payment-kicker"><ShieldCheck size={16} /> Unified secure checkout</span>
              <h1 className="payment-title">Payment desk</h1>
              <p>
                Review your order, apply eligible promos, confirm delivery details, and complete payment from one page.
              </p>
            </div>
            <img
              src={getProductImage(heroImageProduct)}
              alt={heroImageProduct.name}
              onError={handleProductImageError}
            />
          </section>

          {cartLoading ? (
            <div className="payment-state-card">
              <Loader2 size={22} className="spin" />
              <strong>Loading your checkout...</strong>
            </div>
          ) : cartError ? (
            <div className="payment-state-card">
              <strong>{cartError}</strong>
              <button type="button" onClick={() => navigate("/login")}>Go to login</button>
            </div>
          ) : isEmptyCart ? (
            <div className="payment-state-card">
              <strong>Your cart is empty.</strong>
              <button type="button" onClick={() => navigate("/products")}>Back to products</button>
            </div>
          ) : (
            <div className="payment-grid">
              <aside className="payment-order-card">
                <h2><PackageCheck size={18} /> Order Summary</h2>
                <div className="payment-items">
                  {orderItems.map((item) => (
                    <div className="payment-item" key={item.key}>
                      <div className="payment-image-tile">
                        <img src={getProductImage(item.product)} alt={item.name} onError={handleProductImageError} />
                      </div>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.quantity} x Rs {item.price.toFixed(2)}</span>
                      </div>
                      <b>Rs {item.subtotal.toFixed(2)}</b>
                    </div>
                  ))}
                </div>

                {checkoutType === "cart" && (
                  <div className="payment-promo">
                    <label><BadgePercent size={16} /> Promo code</label>
                    <div>
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={promoInput}
                        onChange={(event) => setPromoInput(event.target.value)}
                        disabled={promoApplying}
                      />
                      <button type="button" onClick={handleApplyPromo} disabled={promoApplying}>
                        {promoApplying ? "Applying" : "Apply"}
                      </button>
                    </div>
                    {promoMessage && <p>{promoMessage}</p>}
                  </div>
                )}

                {cartPreview?.discountApplied && (
                  <div className="payment-order-line">
                    <span>Discount</span>
                    <strong>
                      {cartPreview.discountApplied.type === "percentage"
                        ? `${cartPreview.discountApplied.value}%`
                        : `Rs ${cartPreview.discountApplied.value}`}
                    </strong>
                  </div>
                )}

                <div className="payment-order-line">
                  <span>Items</span>
                  <strong>{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</strong>
                </div>
                <div className="payment-order-total">
                  <span>Total</span>
                  <strong>Rs {total.toFixed(2)}</strong>
                </div>
              </aside>

              <form className="payment-form" onSubmit={handleSubmit}>
                <h2><MapPin size={18} /> Customer Details</h2>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                <textarea name="address" placeholder="Delivery Address" value={formData.address} onChange={handleChange} required />

                <h2><CreditCard size={18} /> Payment Method</h2>
                <div className="payment-mode-switch">
                  <label className={formData.paymentMode === "COD" ? "active" : ""}>
                    <input type="radio" name="paymentMode" value="COD" checked={formData.paymentMode === "COD"} onChange={handleChange} />
                    <Banknote size={18} /> Cash on Delivery
                  </label>
                  <label className={formData.paymentMode === "Card" ? "active" : ""}>
                    <input type="radio" name="paymentMode" value="Card" checked={formData.paymentMode === "Card"} onChange={handleChange} />
                    <CreditCard size={18} /> Card
                  </label>
                </div>

                {formData.paymentMode === "Card" && (
                  <div className="card-details">
                    <div className="payment-card-preview">
                      <span>Ruhunu Pay</span>
                      <strong>{formData.cardNumber ? formData.cardNumber.replace(/\d(?=\d{4})/g, "*") : "**** **** **** 0000"}</strong>
                      <small>Encrypted card checkout</small>
                    </div>
                    <input type="text" name="cardNumber" placeholder="Card Number" value={formData.cardNumber} onChange={handleChange} />
                    <input type="password" name="cardcvv" placeholder="CVV" value={formData.cardcvv} onChange={handleChange} />
                  </div>
                )}

                <button type="submit" className="payment-button" disabled={submitting}>
                  {submitting ? "Processing..." : formData.paymentMode === "COD" ? "Place COD Order" : "Pay Now"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <CustomerFooter />
    </>
  );
}
