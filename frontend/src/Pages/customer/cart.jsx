import { useState, useEffect } from "react";
import { addToCart, getCart, getTotal, removeFromCart } from "../../api/cart";
import { Link, useNavigate } from "react-router-dom";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import '../../Css/cart.css'

export default function CartPage() {
    const navigate = useNavigate();

    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const id = user?.id;  // <-- backend _id stored as id

    // Redirect to login if no user found
    useEffect(() => {
        if (!id) {
            navigate("/login");
        }
    }, [id, navigate]);

    const [cart, setCart] = useState(getCart(id));

    // Handlers for adding/removing items
    const handleAdd = (item, qty) => {
        addToCart(id, item, qty);
        setCart(getCart(id));
    };

    const handleRemove = (productId) => {
        removeFromCart(id, productId);
        setCart(getCart(id));
    };

    return (
        <div className="cart-page-container">

            <div className="cart-main-content">
                {/* Cart Items */}
                <div className="cart-items-list">
                    {cart.length === 0 ? (
                        <p className="empty-cart-message">Your cart is empty</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item.productId} className="cart-item-card">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-details">
                                    <h2 className="item-name">{item.name}</h2>
                                    <span className="item-id">ID: {item.productId}</span>
                                    {item.labelledPrice > item.price ? (
                                        <div className="item-price-info">
                                            <span className="original-price">${item.labelledPrice.toFixed(2)}</span>
                                            <span className="current-price">${item.price.toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        <span className="single-price">${item.price.toFixed(2)}</span>
                                    )}
                                </div>

                                <div className="quantity-control">
                                    <button
                                        className="quantity-button minus"
                                        onClick={() => handleAdd(item, -1)}
                                    >
                                        <BiMinus />
                                    </button>
                                    <span className="item-quantity">{item.qty}</span>
                                    <button
                                        className="quantity-button plus"
                                        onClick={() => handleAdd(item, 1)}
                                    >
                                        <BiPlus />
                                    </button>
                                </div>

                                <div className="item-subtotal-container">
                                    <span className="item-subtotal">${(item.price * item.qty).toFixed(2)}</span>
                                </div>

                                <button
                                    className="remove-item-button"
                                    onClick={() => handleRemove(item.productId)}
                                >
                                    <BiTrash />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Summary */}
                {cart.length > 0 && (
                    <div className="cart-summary-desktop">
                        <p className="cart-total-text">Total:</p>
                        <span className="cart-total-amount">${getTotal(id).toFixed(2)}</span>
                        <Link to="/checkout" state={{ cart: cart }} className="checkout-button">
                            Checkout
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );

}
