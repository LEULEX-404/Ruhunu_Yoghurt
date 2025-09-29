import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../Css/stockdashboard.css";

export default function ProductTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("http://localhost:8070/api/stock/products");
        setProducts(res.data);

        // Check for low stock or products expiring within 2 weeks
        res.data.forEach((p) => {
          const today = new Date();
          const expireDate = new Date(p.expDate);
          const twoWeeksFromNow = new Date();
          twoWeeksFromNow.setDate(today.getDate() + 14);

          const isExpiringSoon = expireDate <= twoWeeksFromNow;
          if (isExpiringSoon) {
            toast.error(
              `❌ Product "${p.name}" is expiring soon (${expireDate.toLocaleDateString()})`,
              { duration: 3000 }
              
            );
          } 
        });
      } catch (err) {
        toast.error("");
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="product-container">
      <h2 className="product-title">📦 Product Stock</h2>
      <div className="product-table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Expire Date</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const today = new Date();
              const expireDate = new Date(p.expDate);
              const twoWeeksFromNow = new Date();
              twoWeeksFromNow.setDate(today.getDate() + 14);

              const isExpiringSoon = expireDate <= twoWeeksFromNow;
              const status =
                isExpiringSoon
                  ? "❌ Expiring Soon"
                  
                  : "✅ Available";

              return (
                <tr key={p._id}>
                  <td>{p.productId}</td>
                  <td>{p.name}</td>
                  <td>{status}</td>
                  <td>{expireDate.toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
