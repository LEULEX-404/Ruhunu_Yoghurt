import { Link } from "react-router-dom";
import "../Css/productCard.css";
import { FaStar } from "react-icons/fa";
import { ShoppingBag } from "lucide-react";
import { getProductImage, handleProductImageError } from "../utils/productImage";

export default function ProductCard({ product, index = 0 }) {
    const rating = Number(product.rating || 0);
    const numRatings = Number(product.numRatings || 0);
    const description = product.description || "Fresh Ruhunu dairy made for everyday meals and snacks.";
    const price = Number(product.price > 0 ? product.price : product.labelledPrice || 0);
    const labelledPrice = Number(product.labelledPrice || price);

    const isExpiringSoon = () => {
        if (!product.expDate) {
            return false
        }

        const expDate = new Date(product.expDate)
        const today = new Date()
        const timeDiff = expDate.getTime() - today.getTime()
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

        return daysDiff <= 7 && daysDiff >= 0;
    }

    const isAvailable = product.isAvailable !== false;
    const Wrapper = isAvailable ? Link : "div";
    const wrapperProps = isAvailable ? { to: "/overview/" + product.productId } : {};

    return (
        <Wrapper
            {...wrapperProps}
            style={{ "--reveal-delay": `${Math.min(index % 8, 7) * 65}ms` }}
            className={`product-card slide-reveal
            ${isExpiringSoon() ? "expiring-soon" : ""}
            ${!isAvailable ? "unavailable" : ""}`}>
            <div className="product-card-image-container">
                <div className="product-card-ambient" />
                <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-card-image"
                    onError={handleProductImageError}
                />
                {
                    isExpiringSoon() && (
                        <span className="product-card-expire-badge">
                            Expire within 7 days
                        </span>
                    )
                }
            </div>

            <div className="product-card-info">
                <div>
                    <h2 className="product-card-title">
                        {product.name}
                    </h2>
                    <p className="product-card-description">
                        {
                            description.length > 78
                                ? description.slice(0, 75) + "..."
                                : description
                        }
                    </p>
                </div>

                <div className="product-card-price-stock">
                    <div>
                        {product.price > 0 ? (
                            <>
                                {labelledPrice > price && (
                                    <span className="product-card-labelled-price">
                                        Rs {labelledPrice.toFixed(0)}
                                    </span>
                                )}
                                <span className="product-card-price">
                                    Rs {price.toFixed(0)}
                                </span>
                            </>
                        ) : (
                            <span className="product-card-price">
                                Rs {price.toFixed(0)}
                            </span>
                        )}
                    </div>
                    <span
                        className={`product-card-stock ${isAvailable ? "InStock" : "Out-of-stock"}`}>
                        {isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                </div>

                <div className="product-card-rating">
                    <FaStar className="product-card-rating-icon" />
                    <span>
                        {rating.toFixed(1)} ({numRatings} ratings)
                    </span>
                </div>

                <span className={`product-card-button ${isAvailable ? "available" : "unavailable"}`}>
                    <ShoppingBag size={17} />
                    {isAvailable ? "View Product" : "Unavailable"}
                </span>
            </div>
        </Wrapper>
    )
}
