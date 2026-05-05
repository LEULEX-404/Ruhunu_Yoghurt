import { BsCart3 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import logo from "../images/mainLogo.png";
import "../Css/header.css";

export default function Header() {
    const token = localStorage.getItem("token");

    return (
        <header className="header">
            <Link to="/" className="brand-link">
                <img src={logo} alt="Ruhunu Yoghurt" className="brand-logo" />
                <span>Ruhunu Yoghurt</span>
            </Link>

            <div className="header-left">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/products" className="nav-link">Products</Link>
                <Link to="/products?search=1" className="nav-link nav-search-link">
                    <Search size={16} /> Search
                </Link>
            </div>
            <div className="header-right">
                {
                    token == null ?
                    <Link to="/login" className="btn-login">Login</Link>
                    :
                    <button
                        className="btn-logout"
                        onClick={() => {
                            localStorage.removeItem("token")
                            localStorage.removeItem("user")
                            window.location.href = "/"
                        }}>
                        Logout
                    </button>
                }

                <Link to="/cart" className="cart-icon" aria-label="Cart">
                    <BsCart3 />
                </Link>
            </div>
        </header>
    )
}
