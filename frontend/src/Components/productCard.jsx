import { Link } from "react-router-dom"
import '../Css/productCard.css'
import { FaStar } from "react-icons/fa"

export default function ProductCard({ product }) {

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

    const Wrapper = product.isAvailable ? Link : "div"
    const wrapperProps = product.isAvailable ? {to: "/overview/" + product.productId} : {}

    return (
        <Wrapper
            className={`product-card
            ${isExpiringSoon() ? "expiring-soon" : ""}
            ${!product.isAvailable ? "unavailable" : ""}`}
            {...wrapperProps}>
            <div className="product-card-image-container">
                <img
                    src={product.images?.[0] || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="product-card-image"
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
                            product.description.length > 60
                                ? product.description.slice(0, 57) + "..."
                                : product.description
                        }
                    </p>
                </div>

                <div className="product-card-price-stock">
                    <div>
                        {product.price > 0 ? (
                            <>
                                {product.labelledPrice > product.price && (
                                    <span className="product-card-labelled-price">
                                        Rs {product.labelledPrice}
                                    </span>
                                )}
                                <span className="product-card-price">
                                    Rs {product.price}
                                </span>
                            </>
                        ) : (
                            <span className="product-card-price">
                                Rs {product.labelledPrice}
                            </span>
                        )}
                    </div>
                    <span
                        className={`product-card-stock ${product.isAvailable ? "InStock" : "Out-of-stock"}`}>
                        {product.isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                </div>

                <div className="product-card-rating">
                    <FaStar className="product-card-rating" />
                    <span>
                        {product.rating.toFixed(1)} ({product.numRatings} ratings)
                    </span>
                </div>

                <button
                    disabled={!product.isAvailable}
                    className={`product-card-button ${product.isAvailable ? "available" : "unavailable"}`}>
                    {product.isAvailable ? "Buy Now" : "Unavailable"}
                </button>
            </div>
        </Wrapper>
    )
}
