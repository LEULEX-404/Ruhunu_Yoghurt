import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import '../../Css/cart.css';
import axios from "axios";
import toast from "react-hot-toast";

export default function CartPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem("token");
  const customerId = user?.id;

  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!customerId) navigate("/login");
  }, [customerId, navigate]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8070/api/cart/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart");
    }
  };

  useEffect(() => {
    if (customerId) fetchCart();
  }, [customerId]);

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
    <div className="cart-page-container">
      <div className="cart-main-content">
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty</p>
          ) : cart.map(item => (
            <div key={item.productId._id} className="cart-item-card">
              <img src={item.productId.images[0]} alt={item.productId.name} className="item-image" />
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
                <span className="item-subtotal">Rs {item.subtotal.toFixed(2)}</span>
              </div>

              <button className="remove-item-button" onClick={() => handleRemove(item.productId._id)}>
                <BiTrash />
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary-desktop">
            <p className="cart-total-text">Total:</p>
            <span className="cart-total-amount">Rs{getTotal().toFixed(2)}</span>
            <Link to="/cart/preview" state={{ cart }} className="checkout-button">Checkout</Link>
          </div>
        )}
      </div>
    </div>
  );
}
