import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import '../../Css/damageproduct.css'

export default function DamageProduct() {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state; // product passed from navigate
    const [reason, setReason] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason || !quantity) {
            return toast.error("Please fill in all fields");
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) return toast.error("Please login first");

            await axios.post(
                "http://localhost:8070/api/damage/add",
                {
                    productId: product.productId,
                    name: product.name,
                    reason,
                    quantity: Number(quantity),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Damage product added and stock updated!");
            navigate("/admin/products"); // go back to products page
        } catch (error) {
            console.error(error.response?.data);
            toast.error(error.response?.data?.message || "Failed to add damage product");
        }
    };

    return (
        <div className="admin-product-container">
            <h2>Report Damage Product</h2>
            <form className="damage-form" onSubmit={handleSubmit}>
                <label>Product Name</label>
                <input type="text" value={product.name} disabled />

                <label>Reason</label>
                <input
                    type="text"
                    placeholder="Enter reason for damage"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />

                <label>Quantity</label>
                <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    placeholder={`Max available: ${product.quantity}`}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />

                <button type="submit" className="add-product-link">
                    Submit
                </button>
            </form>
        </div>
    );
}
