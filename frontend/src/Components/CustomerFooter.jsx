import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import logo from "../images/mainLogo.png";
import useSlideReveal from "../utils/useSlideReveal";
import "../Css/footer.css";

export default function CustomerFooter() {
  useSlideReveal("customer-footer");

  const handleSubscribe = (event) => {
    event.preventDefault();
    toast.success("Thanks for subscribing to Ruhunu updates.");
    event.currentTarget.reset();
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left slide-reveal slide-left">
          <img src={logo} alt="Ruhunu Yoghurt logo" className="footer-logo" />
          <p>Ruhunu Yoghurt brings fresh yoghurt, puddings, and ice cream into a cleaner online shopping experience.</p>
          <div className="social-icons">
            <button type="button" aria-label="Facebook"><FaFacebookF /></button>
            <button type="button" aria-label="Instagram"><FaInstagram /></button>
            <button type="button" aria-label="LinkedIn"><FaLinkedinIn /></button>
          </div>
        </div>

        <div className="footer-middle slide-reveal" style={{ "--reveal-delay": "90ms" }}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/products?search=1">Search</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        <div className="footer-right slide-reveal slide-right" style={{ "--reveal-delay": "160ms" }}>
          <h4>Contact Us</h4>
          <p><FaMapMarkerAlt /> Kirindiwela, Gampaha, Sri Lanka</p>
          <p><FaPhone /> 076-215-7137</p>
          <p><FaEnvelope /> itpdairyproduct@gmail.com</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input type="email" placeholder="Subscribe to our newsletter" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright 2026 Ruhunu Yoghurt. All rights reserved.</p>
      </div>
    </footer>
  );
}
