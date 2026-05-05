import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../Components/productCard";
import "../../Css/searchProduct.css";
import Header from "../../Components/header";
import CustomerFooter from "../../Components/CustomerFooter";
import { Search, Sparkles } from "lucide-react";

export default function SearchProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    const handleSearch = async (value) => {
        setQuery(value);
        setIsLoading(true);

        if (value.length === 0) {
            setProducts([]);
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8070/api/products/search/${encodeURIComponent(value)}`);
            setProducts(response.data);
        } catch (error) {
            toast.error("Error fetching products");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="product-search-page">
                <section className="search-hero">
                    <span><Sparkles size={16} /> Quick shelf finder</span>
                    <h1>Search by flavour, pack, or product name</h1>
                    <div className="search-input-shell">
                        <Search size={21} />
                        <input
                            type="text"
                            placeholder="Try mango, vanilla, family pack..."
                            className="search-product"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </section>

                <div className="product-search-results">
                    {query.length === 0 ? (
                        <h1 className="search-message">Start typing to discover Ruhunu products.</h1>
                    ) : isLoading ? (
                        <p className="loading-message">Loading products...</p>
                    ) : products.length === 0 ? (
                        <h1 className="search-message">No matching products found.</h1>
                    ) : (
                        products.map((p) => <ProductCard key={p.productId} product={p} />)
                    )}
                </div>
            </div>
            <CustomerFooter />
        </>
    );
}
