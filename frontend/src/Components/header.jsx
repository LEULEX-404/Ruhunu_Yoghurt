import { BsCart3 } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import "../Css/header.css"

export default function Header(){
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    return(
        <header className="header">
            <div className="header-left">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/products" className="nav-link">Products</Link>
                <Link to="/search" className="nav-link">Search</Link>
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
                            window.location.href = "/login"
                        }}>
                            Logout
                    </button>
                }

                <Link to="/cart" className="cart-icon">
                    <BsCart3/>
                </Link>
            </div>
        </header>
    )
}