import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import "../../Css/cart.css";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../Components/header";
import CustomerFooter from "../../Components/CustomerFooter";
import { ArrowRight, ReceiptText, ShoppingBag } from "lucide-react";
import { getProductImage, handleProductImageError } from "../../utils/productImage";
import useSlideReveal from "../../utils/useSlideReveal";

export default function CartPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const customerId = user?.id;

  const [cart, setCart] = useState([]);

  useSlideReveal(cart.length);

  useEffect(() => {
    if (!customerId) navigate("/login");
  }, [customerId, navigate]);

  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8070/api/cart/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart");
    }
  }, [customerId, token]);

  useEffect(() => {
    if (customerId) fetchCart();
  }, [customerId, fetchCart]);

  const handleAdd = async (item, qty) => {
    try {
      await axios.post("http://localhost:8070/api/cart/add",
        {
          customerId,
          productId: item.productId._id,
          quantity: qty,
          price: item.price,
          weight: item.weight || 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update cart");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.post("http://localhost:8070/api/cart/remove",
        { customerId, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.subtotal, 0);

  if (!cart) return <div className="loading-state">Loading cart...</div>;

  return (
    <>
      <Header />
      <div className="cart-page-container">
        <section className="cart-page-heading slide-reveal slide-down">
          <span><ShoppingBag size={17} /> Your yoghurt basket</span>
          <h1>Cart built for a clean checkout</h1>
        </section>

        <div className="cart-main-content">
          <div className="cart-items-list slide-reveal slide-left" style={{ "--reveal-delay": "90ms" }}>
            {cart.length === 0 ? (
              <p className="empty-cart-message slide-reveal">Your cart is empty. Add fresh products from the shelf.</p>
            ) : cart.map((item, index) => (
              <div
                key={item.productId._id}
                className="cart-item-card slide-reveal slide-left"
                style={{ "--reveal-delay": `${Math.min(index, 7) * 70}ms` }}
              >
                <div className="item-image-wrap">
                  <img
                    src={getProductImage(item.productId)}
                    alt={item.productId.name}
                    className="item-image"
                    onError={handleProductImageError}
                  />
                </div>
                <div className="item-details">
                  <h2 className="item-name">{item.productId.name}</h2>
                  <span className="item-id">ID: {item.productId.productId}</span>
                  <span className="single-price">Rs {item.price.toFixed(2)}</span>
                </div>

                <div className="quantity-control">
                  <button className="quantity-button minus" onClick={() => handleAdd(item, -1)}>
                    <BiMinus />
                  </button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button className="quantity-button plus" onClick={() => handleAdd(item, 1)}>
                    <BiPlus />
                  </button>
                </div>

                <div className="item-subtotal-container">
                  <small>Line total</small>
                  <span className="item-subtotal">Rs {item.subtotal.toFixed(2)}</span>
                </div>

                <button className="remove-item-button" onClick={() => handleRemove(item.productId._id)}>
                  <BiTrash />
                </button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="cart-summary-desktop slide-reveal slide-right" style={{ "--reveal-delay": "170ms" }}>
              <ReceiptText size={26} />
              <p className="cart-total-text">Order Total</p>
              <span className="cart-total-amount">Rs {getTotal().toFixed(2)}</span>
              <div className="cart-summary-row"><span>Items</span><strong>{cart.length}</strong></div>
              <div className="cart-summary-row"><span>Delivery</span><strong>Calculated next</strong></div>
              <button type="button" className="checkout-button" onClick={() => navigate("/payment", { state: { mode: "cart" } })}>
                Checkout <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      <CustomerFooter />
    </>
  );
}
