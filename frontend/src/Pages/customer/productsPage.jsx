import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCard from "../../Components/productCard";
import Header from "../../Components/header";
import CustomerFooter from "../../Components/CustomerFooter";
import "../../Css/customerProductsPage.css";
import { ArrowDownUp, BadgeCheck, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import useSlideReveal from "../../utils/useSlideReveal";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        rating: "",
        sort: ""
    });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");
                const query = new URLSearchParams(filters).toString();
                const response = await axios.get(
                    `http://localhost:8070/api/products/public?${query}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setProducts(response.data);
            } catch (error) {
                console.error(error.response?.data);
                toast.error("Error fetching products");
            }
        };

        fetchProducts();
    }, [filters]);

    const visibleProducts = useMemo(() => {
        const term = searchQuery.trim().toLowerCase();
        if (!term) return products;

        return products.filter((product) => {
            return [
                product.name,
                product.productId,
                product.description,
                ...(Array.isArray(product.altNames) ? product.altNames : []),
            ].filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
        });
    }, [products, searchQuery]);

    useSlideReveal(`${visibleProducts.length}-${searchQuery}-${filters.rating}-${filters.sort}`);

    return (
        <div className="product-page-container">
            <Header />

            <section className="customer-shop-hero">
                <div className="slide-reveal slide-left">
                    <span className="customer-shop-kicker">
                        <Sparkles size={16} /> Fresh dairy collection
                    </span>
                    <h1>Ruhunu Yoghurt Shelf</h1>
                    <p>
                        Browse smooth yoghurt cups, drinkables, and family packs with a cleaner shopping experience.
                    </p>
                </div>
                <div className="customer-shop-stats slide-reveal slide-right" style={{ "--reveal-delay": "120ms" }}>
                    <span>{products.length}</span>
                    <small>products shown</small>
                </div>
            </section>

            <section className="shop-search-panel slide-reveal" id="product-search">
                <Search size={22} />
                <input
                    type="search"
                    value={searchQuery}
                    placeholder="Search yoghurt, pudding, ice cream..."
                    onChange={(event) => setSearchQuery(event.target.value)}
                />
            </section>

            <aside className="filter-section slide-reveal" style={{ "--reveal-delay": "90ms" }}>
                <h3><SlidersHorizontal size={18} /> Refine shelf</h3>

                <div className="filter-group">
                    <label htmlFor="rating"><BadgeCheck size={15} /> Rating</label>
                    <select
                        id="rating"
                        value={filters.rating}
                        onChange={(e) =>
                            setFilters({ ...filters, rating: e.target.value })
                        }
                    >
                        <option value="">All</option>
                        <option value="1-3">1 - 3 stars</option>
                        <option value="3plus">Above 3 stars</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="sort"><ArrowDownUp size={15} /> Price</label>
                    <select
                        id="sort"
                        value={filters.sort}
                        onChange={(e) =>
                            setFilters({ ...filters, sort: e.target.value })
                        }
                    >
                        <option value="">Default</option>
                        <option value="price_asc">Low to High</option>
                        <option value="price_desc">High to Low</option>
                    </select>
                </div>
            </aside>

            <section className="product-grid">
                {visibleProducts.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    visibleProducts.map((p, index) => (
                        <ProductCard key={p.productId} product={p} index={index} />
                    ))
                )}
            </section>
            <CustomerFooter />
        </div>
    );
}
