import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../Components/imageSlider";
import Header from "../../Components/header";
import CustomerFooter from "../../Components/CustomerFooter";
import "../../Css/productOverview.css";
import { FaStar } from "react-icons/fa";
import { ChevronLeft, PackageCheck, ShieldCheck, ShoppingCart, Zap } from "lucide-react";
import { getProductImage, handleProductImageError } from "../../utils/productImage";
import useSlideReveal from "../../utils/useSlideReveal";

export default function ProductOverViewPage() {
    const params = useParams();
    const productId = params.id;
    const [product, setProduct] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const id = user?.id;

    useSlideReveal(product?._id || productId);

    useEffect(() => {
        axios.get("http://localhost:8070/api/products/" + productId)
            .then((response) => setProduct(response.data))
            .catch((error) => {
                console.log(error);
                toast.error("Error fetching product details");
            });
    }, [productId]);

    const ratingSubmit = async (ratingValue) => {
        try {
            const response = await axios.post("http://localhost:8070/api/products/add-rating", {
                productId,
                newRating: ratingValue,
            });
            setProduct(prevProduct => ({
                ...prevProduct,
                rating: response.data.rating,
                numRatings: response.data.numRatings
            }));
            toast.success(`Thanks! You rated this product ${ratingValue} stars`);
            setUserRating(0);
        } catch (error) {
            console.log(error);
            toast.error("Error submitting rating.");
        }
    };

    const handleRatingChange = async (ratingValue) => {
        setUserRating(ratingValue);
        await ratingSubmit(ratingValue);
    };

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            const sendPrice = product.price > 0 ? product.price : product.labelledPrice;

            await axios.post(
                "http://localhost:8070/api/cart/add",
                {
                    customerId: id,
                    productId: product._id,
                    quantity: 1,
                    price: sendPrice,
                    weight: product.weight
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`${product.name} added to cart!`);
        } catch (err) {
            console.log(err);
            toast.error("Failed to add to cart");
        }
    };

    if (!product) {
        return (
            <>
                <Header />
                <div className="product-overview-page">
                    <div className="loading-state">Loading product details...</div>
                </div>
                <CustomerFooter />
            </>
        );
    }

    const currentPrice = Number(product.price > 0 ? product.price : product.labelledPrice || 0);
    const labelledPrice = Number(product.labelledPrice || currentPrice);

    return (
        <>
            <Header />
            <div className="product-overview-page">
                <div className="product-overview-container">
                    <button className="overview-back-button slide-reveal slide-left" onClick={() => navigate("/products")}>
                        <ChevronLeft size={18} /> Back to products
                    </button>

                    <h1 className="product-title-mobile slide-reveal slide-down">
                        {product.name}
                        {product.altNames?.map((altName, index) => (
                            <span key={index} className="product-alt-name">{" | " + altName}</span>
                        ))}
                    </h1>

                    <div className="product-main-content">
                        <div className="product-image-section slide-reveal slide-left" style={{ "--reveal-delay": "80ms" }}>
                            <div className="overview-product-stage">
                                <ImageSlider product={product} alt={product.name} />
                            </div>
                        </div>

                        <div className="product-details-section slide-reveal slide-right" style={{ "--reveal-delay": "160ms" }}>
                            <div className="product-details-content">
                                <span className="overview-eyebrow slide-reveal slide-down" style={{ "--reveal-delay": "220ms" }}>
                                    <PackageCheck size={16} /> Fresh batch profile
                                </span>
                                <h1 className="product-title-desktop slide-reveal" style={{ "--reveal-delay": "260ms" }}>
                                    {product.name}
                                    {product.altNames?.map((altName, index) => (
                                        <span key={index} className="product-alt-name">{" | " + altName}</span>
                                    ))}
                                </h1>

                                <h2 className="product-id slide-reveal" style={{ "--reveal-delay": "300ms" }}>Batch code {product.productId}</h2>
                                <p className="product-description slide-reveal" style={{ "--reveal-delay": "340ms" }}>
                                    {product.description || "A fresh Ruhunu dairy product prepared for a smooth, creamy everyday treat."}
                                </p>

                                <div className="product-info-grid slide-reveal" style={{ "--reveal-delay": "380ms" }}>
                                    <div className="info-item">
                                        <ShieldCheck size={18} />
                                        <span>
                                            <strong>Net weight</strong>
                                            {product.weight} {product.unit}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <Zap size={18} />
                                        <span>
                                            <strong>Availability</strong>
                                            {product.isAvailable ? "Ready to order" : "Currently unavailable"}
                                        </span>
                                    </div>
                                </div>

                                <div className="product-price-container slide-reveal" style={{ "--reveal-delay": "420ms" }}>
                                    {product.price > 0 && labelledPrice > currentPrice ? (
                                        <>
                                            <span className="product-labelled-price">Rs {labelledPrice.toFixed(2)}</span>
                                            <span className="product-price-single">Rs {currentPrice.toFixed(2)}</span>
                                        </>
                                    ) : (
                                        <span className="product-price-single">Rs {currentPrice.toFixed(2)}</span>
                                    )}
                                </div>

                                <div className="product-rating slide-reveal" style={{ "--reveal-delay": "460ms" }}>
                                    <FaStar className="product-rating-icon" />
                                    <span>{Number(product.rating || 0).toFixed(1)} ({product.numRatings || 0} ratings)</span>
                                </div>

                                <div className="rating-section slide-reveal" style={{ "--reveal-delay": "500ms" }}>
                                    <h4>Rate this product</h4>
                                    <div className="stars-container">
                                        {[...Array(5)].map((star, index) => {
                                            const ratingValue = index + 1;
                                            return (
                                                <label key={index}>
                                                    <input
                                                        type="radio"
                                                        name="rating"
                                                        value={ratingValue}
                                                        onClick={() => handleRatingChange(ratingValue)}
                                                        style={{ display: "none" }}
                                                    />
                                                    <FaStar
                                                        className="star"
                                                        color={ratingValue <= (userRating || product.rating) ? "#f4a51c" : "#d6d9d2"}
                                                        size={25}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="product-actions slide-reveal" style={{ "--reveal-delay": "540ms" }}>
                                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
                                    <button
                                        className="buy-now-button"
                                        onClick={() => navigate("/payment", {
                                            state: {
                                                product: {
                                                    _id: product._id,
                                                    productId: product.productId,
                                                    name: product.name,
                                                    price: product.price,
                                                    labelledPrice: product.labelledPrice,
                                                    weight: product.weight,
                                                    unit: product.unit,
                                                    qty: 1,
                                                    image: getProductImage(product)
                                                }
                                            }
                                        })}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="overview-process-band">
                        <div className="slide-reveal slide-left">
                            <img src={getProductImage(product)} alt={product.name} onError={handleProductImageError} />
                            <span>Cold handled</span>
                        </div>
                        <div className="slide-reveal" style={{ "--reveal-delay": "90ms" }}>
                            <img src={getProductImage(product)} alt={product.name} onError={handleProductImageError} />
                            <span>Checked stock</span>
                        </div>
                        <div className="slide-reveal slide-right" style={{ "--reveal-delay": "180ms" }}>
                            <img src={getProductImage(product)} alt={product.name} onError={handleProductImageError} />
                            <span>Fast dispatch</span>
                        </div>
                    </section>
                </div>
            </div>
            <CustomerFooter />
        </>
    );
}
