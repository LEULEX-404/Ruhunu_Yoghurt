import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../../Css/payment.css";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"));

  // product comes from Buy Now button
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    paymentMode: "COD",
    cardNumber: "",
    cardcvv: "",
  });

  if (!product) {
    return (
      <div className="payment-container">
        <h2>No product selected for payment.</h2>
      </div>
    );
  }

  const total =
    product.price && product.price > 0 && product.labelledPrice > product.price
      ? product.price * product.qty
      : product.labelledPrice * product.qty;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8070/api/payments", {
        ...formData,
        products: [
          {
            productId: product.productId,
            qty: product.qty,
          },
        ],
      }, {
        headers : {
          Authorization : `Bearer ${token}`,
        },
        withCredentials : true
      });

      toast.success("Payment successful!");
      // navigate("/success", { state: { paymentId: response.data.paymentId } });
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Payment Checkout</h1>

      <div className="payment-summary">
        <h2>Order Summary</h2>
        <p><strong>Product:</strong> {product.name}</p>
        <p><strong>Quantity:</strong> {product.qty}</p>
        <p><strong>Total:</strong> Rs. {total.toFixed(2)}</p>
      </div>

      <form className="payment-form" onSubmit={handleSubmit}>
        <h2>Customer Details</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
          required
        ></textarea>

        <h2>Payment Method</h2>
        <select
          name="paymentMode"
          value={formData.paymentMode}
          onChange={handleChange}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Card">Card Payment</option>
        </select>

        {formData.paymentMode === "Card" && (
          <div className="card-details">
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleChange}
            />
            <input
              type="password"
              name="cardcvv"
              placeholder="CVV"
              value={formData.cardcvv}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit" className="payment-button">
          Confirm Payment
        </button>
      </form>
    </div>
  );
}
