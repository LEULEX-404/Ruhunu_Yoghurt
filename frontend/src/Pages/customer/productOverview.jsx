import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../Components/imageSlider";
import '../../Css/productOverview.css'
import { FaStar } from "react-icons/fa";
import { addToCart, getCart } from "../../api/cart";

export default function ProductOverViewPage() {
    const params = useParams();
    const productId = params.id;
    const [product, setProduct] = useState(null)
    const [userRating, setUserRating] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:8070/api/products/' + productId)
            .then((response) => {
                console.log(response.data)
                setProduct(response.data)
            })
            .catch((error) => {
                console.log(error);
                toast.error("Error fetching product details")
            })
    }, [productId])

    const ratingSubmit = async (ratingValue) => {
        try {
            const response = await axios.post('http://localhost:8070/api/products/add-rating', {
                productId: productId,
                newRating: ratingValue,
            })

            setProduct(prevProduct => ({
                ...prevProduct,
                rating: response.data.rating,
                numRatings: response.data.numRatings
            }))
            toast.success(`Thanks! You rated this product ${ratingValue} ⭐`);
            setUserRating(0)
        } catch (error) {
            console.log(error)
            toast.error("Error submittng rating.")
        }
    }

    const handleRatingChange = async (ratingValue) => {
        setUserRating(ratingValue);
        await ratingSubmit(ratingValue);
    };

    return (
        <>
            {!product ? (
                <div className="loading-state">
                    Loading product details
                </div>
            ) : (
                <div className="product-overview-container">
                    <h1 className="product-title-mobile">
                        {product.name}
                        {product.altNames.map((altName, index) => (
                            <span key={index} className="product-alt-name">
                                {" | " + altName}
                            </span>
                        ))}
                    </h1>
                    <div className="product-image-section">
                        <ImageSlider images={product.images} />
                    </div>
                    <div className="product-details-section">
                        <div className="product-details-content">
                            <h1 className="product-title-desktop">
                                {product.name}
                                {product.altNames.map((altName, index) => (
                                    <span key={index} className="product-alt-name">{" | " + altName}</span>
                                ))}
                            </h1>
                            <h2 className="product-id">
                                {product.productId}
                            </h2>
                            <p className="product-description">
                                {product.description}
                            </p>
                            <div className="product-info-grid">
                                <div className="info-item">
                                    <strong>Weight:</strong> {product.weight} {product.unit}
                                </div>
                            </div>
                            {
                                product.labelledPrice > product.price ?
                                    <div className="product-price-container">
                                        <span className="product-labelled-price">
                                            {product.labelledPrice.toFixed(2)}
                                        </span>
                                        <span className="product-price-single">
                                            {product.price.toFixed(2)}
                                        </span>
                                    </div> :
                                    <span className="product-price-single">
                                        {product.price.toFixed(2)}
                                    </span>
                            }
                            <div className="product-rating">
                                <FaStar className="product-card-rating" />
                                <span>
                                    {product.rating.toFixed(1)} ({product.numRatings} ratings)
                                </span>
                            </div>
                            <div className="rating-section">
                                <h4>Rate this product:</h4>
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
                                                    style={{display: "none"}} />
                                                <FaStar
                                                    className="star"
                                                    color={ratingValue <= (userRating || product.rating) ? "#ffc107" : "#e4e5e9"}
                                                    size={25}
                                                />
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="product-actions">
                                <button
                                    className="add-to-cart-button"
                                    onClick={() => {
                                        console.log("Old Cart")
                                        console.log(getCart());
                                        addToCart(product, 1)
                                        console.log("New Cart")
                                        console.log(getCart())
                                    }}>
                                    Add to Cart
                                </button>
                                <button
                                    className="buy-now-button"
                                    onClick={() => {
                                        navigate("/payment", {
                                            state: {
                                                cart: [
                                                    {
                                                        productId: product.productId,
                                                        name: product.name,
                                                        image: product.image || (product.images ? product.images[0] : ""),
                                                        price: product.price,
                                                        labelledPrice: product.labelledPrice,
                                                        qty: 1
                                                    }
                                                ]
                                            }
                                        })
                                    }}>
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}