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
        <div className="cart-page-contaienr">
            {/* Desktop Summary */}
            <div className="cart-summary-desktop">
                <p className="cart-total-text">Total:</p>
                <span className="cart-total-amount">
                    {getTotal(id).toFixed(2)}
                </span>
                <Link 
                    to="/checkout" 
                    state={{ cart: cart }} 
                    className="checkout-button"
                >
                    Checkout
                </Link>
            </div>

            {/* Cart Items */}
            {cart.map((item) => (
                <div key={item.productId} className="cart-item-card">
                    <img src={item.image} className="item-image" />
                    <div className="item-details">
                        <h1 className="item-name">{item.name}</h1>
                        <h1 className="item-id">{item.productId}</h1>
                        {item.labelledPrice > item.price ? (
                            <div className="item-price-info">
                                <span className="original-price">{item.labelledPrice.toFixed(2)}</span>
                                <span className="current-price">{item.price.toFixed(2)}</span>
                            </div>
                        ) : (
                            <span className="single-price">{item.price.toFixed(2)}</span>
                        )}
                    </div>

                    <div className="quantity-control">
                        <button
                            className="quantity-button minus"
                            onClick={() => handleAdd(item, -1)}
                        >
                            <BiMinus />
                        </button>
                        <h1 className="item-quantity">{item.qty}</h1>
                        <button
                            className="quantity-button plus"
                            onClick={() => handleAdd(item, 1)}
                        >
                            <BiPlus />
                        </button>
                    </div>

                    <div className="item-subtotal-container">
                        <span className="item-subtotal">
                            {(item.price * item.qty).toFixed(2)}
                        </span>
                    </div>

                    <button
                        className="remove-item-button"
                        onClick={() => handleRemove(item.productId)}
                    >
                        <BiTrash />
                    </button>
                </div>
            ))}

            {/* Mobile Summary */}
            <div className="cart-summary-mobile">
                <p className="cart-total-text">Total:</p>
                <span className="cart-total-amount">{getTotal(id).toFixed(2)}</span>
                <Link 
                    to="/checkout" 
                    state={{ cart: cart }} 
                    className="checkout-button"
                >
                    Checkout
                </Link>
            </div>
        </div>
    );
}
