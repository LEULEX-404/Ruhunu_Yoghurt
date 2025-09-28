import { useState, useEffect } from "react";
import '../Css/newpayment.css';

export default function PaymentPage({ user, order }) {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Example: calculate total from order items
    if (order && order.items) {
      const sum = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalAmount(sum);
    }
  }, [order]);

  const handleConfirmPayment = async () => {
    try {
      const paymentData = {
        amount: totalAmount,
        userId: user._id,
        orderId: order._id,
      };

      const response = await fetch('http://localhost:8070/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server error:', text);
        return;
      }

      const data = await response.json();
      console.log('Payment confirmed:', data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="payment-container">
        <h1>Payment Page</h1>
        <p>Total Amount: {totalAmount}</p>
            <button onClick={handleConfirmPayment}>Confirm Payment</button>
  </div>
  
  );
}
