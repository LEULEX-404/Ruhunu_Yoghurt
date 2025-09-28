import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import '../../Css/adminProductsPage.css';

export default function AdminProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Please login first");
                    return;
                }
                const response = await axios.get("http://localhost:8070/api/products", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error.response?.data);
                toast.error("Error fetching products");
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const deleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login first");
                return;
            }
            await axios.delete(`http://localhost:8070/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Product deleted successfully");
            setProducts(products.filter(p => p.productId !== productId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
    };

    if (isLoading) return <div className="loading">Loading products...</div>;
    if (products.length === 0) return <div className="no-products">No products to display.</div>;

    return (
        <div className="admin-product-container">
            <Link to="/admin/add-product" className="add-product-link">Add Product</Link>
            <div className="product-table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Labelled Price</th>
                            <th>Price</th>
                            <th>Availability</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <tr key={item.productId}>
                                <td>{item.productId}</td>
                                <td>{item.name}</td>
                                <td>
                                    <img className="product-table-image" src={item.images[0]} alt={item.name} />
                                </td>
                                <td>{item.labelledPrice}</td>
                                <td>{item.price}</td>
                                <td>{item.isAvailable ? "Available" : "Unavailable"}</td>
                                <td className="product-table-actions">
                                    <button className="delete-btn" onClick={() => deleteProduct(item.productId)}>
                                        <FaTrash />
                                    </button>
                                    <button className="edit-btn" onClick={() => navigate("/admin/edit-product", { state: item })}>
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
