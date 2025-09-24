import { useState } from "react";
import { addToCart, getCart, getTotal, removeFromCart } from "../../api/cart";
import { Link } from "react-router-dom";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import '../../Css/cart.css'

export default function CartPage(){
    const [cart, setCart] = useState(getCart())

    return(
        <div className="cart-page-contaienr">
            <div className="cart-summary-desktop">
                <p className="cart-total-text">Total:</p>
                <span className="cart-total-amount">
                    {getTotal().toFixed(2)}
                </span>
                <Link to="/checkout" state={{
                    cart : cart
                }} className="checkout-button">Checkout</Link>
            </div>
            {
                cart.map((item) => {
                    console.log(item)
                    return(
                        <div key={item.productId} className="cart-item-card">
                            <img src={item.image} className="item-image" />
                            <div className="item-details">
                                <h1 className="item-name">
                                    {item.name}
                                </h1>
                                <h1 className="item-id">
                                    {item.productId}
                                </h1>
                                {
                                    item.labelledPrice > item.price ? 
                                    <div className="item-price-info">
                                        <span className="current-price">
                                            {item.labelledPrice.toFixed(2)}
                                        </span>
                                        <span className="current-price">
                                            {item.price.toFixed(2)}
                                        </span>
                                    </div> :
                                    <span className="single-price">
                                        {item.price.toFixed(2)}
                                    </span>
                                }
                            </div>
                            <div className="quantity-control">
                                <button 
                                    className="quantity-button minus"
                                    onClick={() => {
                                        addToCart(item, -1)
                                        setCart(getCart())
                                    }}>
                                        <BiMinus/>
                                </button>
                                <h1 className="item-quantity">
                                    {item.qty}
                                </h1>
                                <button
                                    className="quantity-button plus"
                                    onClick={() => {
                                        addToCart(item, 1)
                                        setCart(getCart())
                                    }}>
                                        <BiPlus/>
                                </button>
                            </div>
                            <div className="item-subtotal-container">
                                <span className="item-subtotal">
                                    {(item.price * item.qty).toFixed(2)}
                                </span>
                            </div>
                            <button
                                className="remove-item-button"
                                onClick={() => {
                                    removeFromCart(item.productId)
                                    setCart(getCart)
                                }}>
                                    <BiTrash/>
                                </button>
                        </div>
                    )
                })
            }
        </div>
    )
}