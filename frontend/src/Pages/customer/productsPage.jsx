import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../../Components/productCard";
import "../../Css/customerProductsPage.css"; // ✅ Import CSS file

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        rating: "",
        sort: ""
    });

    const fetchProducts = async () => {
        try {
            const query = new URLSearchParams(filters).toString();
            const response = await axios.get(`http://localhost:8070/api/products?${query}`);
            setProducts(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching products");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    return (
        <div className="product-page-container">
            {/* ✅ Filter Section */}
            <aside className="filter-section">
                <h3>Filter Products</h3>

                <div className="filter-group">
                    <label htmlFor="rating">Rating:</label>
                    <select
                        id="rating"
                        value={filters.rating}
                        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="1-3">1 - 3 ⭐</option>
                        <option value="3plus">Above 3 ⭐</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="sort">Sort by Price:</label>
                    <select
                        id="sort"
                        value={filters.sort}
                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    >
                        <option value="">Default</option>
                        <option value="price_asc">Low → High</option>
                        <option value="price_desc">High → Low</option>
                    </select>
                </div>
            </aside>

            {/* ✅ Product Grid */}

            <section className="product-grid">
                {products.length === 0 ? (
                    <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#666" }}>
                        No products found
                    </p>
                ) : (
                    products.map((p) => (
                        <ProductCard key={p.productId} product={p} />
                    ))
                )}
            </section>

        </div>
    );
}
