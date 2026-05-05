import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../Css/Home.css";
import "../Css/About.css";
import "../Css/services.css";
import "../Css/features.css";
import "../Css/contact.css";
import "../Css/hero.css";
import "../Css/navBar.css";
import "../Css/footer.css";
import {
  FaBox,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaGlassWhiskey,
  FaIceCream,
  FaInstagram,
  FaLeaf,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaRecycle,
  FaTruck,
} from "react-icons/fa";
import logo from "../images/mainLogo.png";
import biscuitPudding from "../assets/products/biscuit_pudding.png";
import iceCream from "../assets/products/ice_cream_1l.png";
import jellyYoghurt from "../assets/products/jelly_yoghurt.png";
import milkYoghurt from "../assets/products/milk_youghurt.png";
import watalappan from "../assets/products/watalappan.webp";
import yoghurtFamily from "../assets/products/yoghurt-family-cutout.png";
import useSlideReveal from "../utils/useSlideReveal";

function Home() {
  const navigate = useNavigate();

  const sections = [
    { id: "hero", name: "Home" },
    { id: "about", name: "About" },
    { id: "services", name: "Products" },
    { id: "features", name: "Experience" },
    { id: "contact", name: "Contact" },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [showMore, setShowMore] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
  });

  useSlideReveal(current);

  const slides = [
    {
      title: "Ruhunu Yoghurt, Fresh From the Chill Room",
      text: "Order creamy yoghurt, puddings, and ice cream prepared for everyday family moments with clean handling and fast dispatch.",
      image: yoghurtFamily,
      btn: "Shop Products",
      action: () => navigate("/products"),
    },
    {
      title: "Real Product Images. Real Shelf Choices.",
      text: "Browse the same Ruhunu favourites you expect in-store, with product cutouts, clear prices, and quick cart checkout.",
      image: milkYoghurt,
      btn: "View Range",
      action: () => navigate("/products?search=1"),
    },
    {
      title: "Desserts Ready for the Weekend Table",
      text: "From jelly yoghurt to watalappan, choose chilled treats that look as good on the page as they do at home.",
      image: watalappan,
      btn: "Explore Treats",
      action: () => navigate("/products"),
    },
  ];

  const services = [
    {
      title: "Fresh Yoghurt",
      icon: <FaGlassWhiskey />,
      desc: "Smooth milk yoghurt made for daily breakfast, snacks, and family packs.",
      more: "Each product page shows matching imagery, weight, price, rating, and fast cart actions.",
    },
    {
      title: "Pudding Cups",
      icon: <FaBox />,
      desc: "Jelly pudding, biscuit pudding, and watalappan for chilled dessert orders.",
      more: "Dessert products use the real cutout photos you added, keeping the shop consistent.",
    },
    {
      title: "Ice Cream Packs",
      icon: <FaIceCream />,
      desc: "1L, 2L, and 4L options for home freezers, parties, and small events.",
      more: "Large pack sizes are presented clearly so customers can pick the right volume quickly.",
    },
    {
      title: "Cold Delivery",
      icon: <FaTruck />,
      desc: "Orders are prepared around freshness and delivered with cold-chain care.",
      more: "The cart-to-payment flow keeps review, promo, and payment in one clean checkout.",
    },
    {
      title: "Clean Ingredients",
      icon: <FaLeaf />,
      desc: "Product details focus on simple dairy enjoyment, clear labeling, and trust.",
      more: "The customer view avoids broken stock images and keeps attention on Ruhunu products.",
    },
    {
      title: "Fast Reorder",
      icon: <FaClock />,
      desc: "Cart, search, and payment are built for quick repeat shopping.",
      more: "Customers can search on the products page, add items, and complete payment without page confusion.",
    },
  ];

  const features = [
    {
      title: "Matching Product Photos",
      icon: <FaClock />,
      desc: "Product tiles, overview, cart, and payment use the same local Ruhunu product images.",
    },
    {
      title: "Unified Checkout",
      icon: <FaRecycle />,
      desc: "Cart checkout and buy-now orders finish from the same professional payment desk.",
    },
    {
      title: "Clear Order Summary",
      icon: <FaBox />,
      desc: "Customers see item photos, quantities, promo code status, and totals before paying.",
    },
    {
      title: "Fresh Brand Feel",
      icon: <FaLeaf />,
      desc: "The public home page now talks like a Ruhunu yoghurt shop, not a generic system dashboard.",
    },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message received. Our customer team will contact you soon.");
    setFormData({ name: "", email: "", title: "", description: "" });
  };

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Ruhunu Yoghurt logo" className="navbar-logo" />
          <span className="navbar-brand">Ruhunu Yoghurt</span>
        </div>

        <ul className="navbar-center">
          {sections.map((sec) => (
            <li key={sec.id}>
              <button
                className={activeSection === sec.id ? "active" : ""}
                onClick={() => scrollToSection(sec.id)}
              >
                {sec.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="signup-btn" onClick={() => navigate("/products")}>Shop Now</button>
        </div>
      </nav>

      <section id="hero" className="hero-static">
        <div className="slides-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>
          {slides.map((slide, index) => (
            <div key={index} className="hero-slide">
              <div className="hero-content-static">
                <div className="hero-text-static slide-reveal slide-left" style={{ "--reveal-delay": "80ms" }}>
                  <span className="hero-eyebrow">Fresh dairy storefront</span>
                  <h1>{slide.title}</h1>
                  <p>{slide.text}</p>
                  <button className="hero-btn-static" onClick={slide.action}>{slide.btn}</button>
                </div>
                <div className="hero-image-static slide-reveal slide-right" style={{ "--reveal-delay": "180ms" }}>
                  <img src={slide.image} alt={slide.title} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="prev-btn" onClick={prevSlide} aria-label="Previous slide">&lt;</button>
        <button className="next-btn" onClick={nextSlide} aria-label="Next slide">&gt;</button>

        <div className="hero-waves" aria-hidden="true">
          <svg className="waves wave1" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs>
              <path id="ruhunu-wave-1" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#ruhunu-wave-1" x="48" y="0" fill="rgba(255,255,255,0.9)" />
            </g>
          </svg>

          <svg className="waves wave2" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs>
              <path id="ruhunu-wave-2" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#ruhunu-wave-2" x="48" y="2" fill="rgba(208,232,205,0.82)" />
            </g>
          </svg>

          <svg className="waves wave3" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs>
              <path id="ruhunu-wave-3" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#ruhunu-wave-3" x="48" y="5" fill="rgba(141,196,151,0.42)" />
            </g>
          </svg>
        </div>
      </section>

      <section id="about" className="aboutpage-section">
        <div className="aboutpage-container">
          <div className="aboutpage-copy slide-reveal slide-left">
            <h2 className="aboutpage-title">About Ruhunu Yoghurt</h2>
            <p className="aboutpage-text">
              We bring <span>fresh yoghurt, puddings, and ice cream</span> into one easy online shelf for Ruhunu customers.
            </p>

            {showMore && (
              <div className="aboutpage-more">
                <p>
                  The store is designed around clear product photos, readable prices, quick search, and one payment flow.
                  From overview to cart, every customer page keeps the product in focus.
                </p>
              </div>
            )}

            <button className="aboutpage-btn" onClick={() => setShowMore(!showMore)}>
              {showMore ? "Show Less" : "Read More"}
            </button>
            <button className="aboutpage-btn secondary" onClick={() => setShowPopup(true)}>
              Learn More
            </button>
          </div>

          <div className="aboutpage-image-stack slide-reveal slide-right" style={{ "--reveal-delay": "120ms" }}>
            <img src={jellyYoghurt} alt="Ruhunu jelly yoghurt" />
            <img src={iceCream} alt="Ruhunu ice cream pack" />
            <img src={biscuitPudding} alt="Ruhunu biscuit pudding" />
          </div>

          {showPopup && (
            <div className="aboutpage-popup">
              <div className="aboutpage-popup-content">
                <h3>Why Customers Choose Ruhunu</h3>
                <ul>
                  <li>Fresh local dairy products with clear details</li>
                  <li>Real product photos across every customer page</li>
                  <li>Search, cart, promo, and payment in a simple flow</li>
                  <li>Chilled desserts for everyday and family occasions</li>
                </ul>
                <button className="aboutpage-close" onClick={() => setShowPopup(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="services" className="servicespage-section">
        <h2 className="servicespage-title slide-reveal slide-down">Shop the Ruhunu Range</h2>
        <p className="servicespage-subtext slide-reveal" style={{ "--reveal-delay": "80ms" }}>
          Yoghurt cups, dessert packs, and ice cream presented with matching product visuals.
        </p>

        <div className="servicespage-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className="servicespage-card slide-reveal"
              style={{ "--reveal-delay": `${Math.min(index, 5) * 70}ms` }}
            >
              <div className="servicespage-card-inner">
                <div className="servicespage-card-front">
                  <div className="servicespage-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </div>
                <div className="servicespage-card-back">
                  <h3>{service.title}</h3>
                  <p>{service.more}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="features-section">
        <h2 className="features-title slide-reveal slide-down">What Makes the Store Feel Better</h2>
        <p className="features-subtext slide-reveal" style={{ "--reveal-delay": "80ms" }}>
          A cleaner customer journey from home page discovery to payment confirmation.
        </p>

        <div className="features-timeline">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`features-item ${index % 2 === 0 ? "left slide-reveal slide-left" : "right slide-reveal slide-right"}`}
              style={{ "--reveal-delay": `${index * 90}ms` }}
            >
              <div className="features-content">
                <div className="features-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2 className="contact-title slide-reveal slide-down">Contact Ruhunu Yoghurt</h2>
        <p className="contact-subtext slide-reveal" style={{ "--reveal-delay": "80ms" }}>
          Questions about products, bulk dessert orders, or delivery? Send us a message.
        </p>

        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-card slide-reveal slide-left">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <p>itpdairyproduct@gmail.com</p>
            </div>

            <div className="contact-card slide-reveal slide-left" style={{ "--reveal-delay": "80ms" }}>
              <FaPhone className="contact-icon" />
              <h3>Phone</h3>
              <p>076-215-7137</p>
            </div>

            <div className="contact-card slide-reveal slide-left" style={{ "--reveal-delay": "160ms" }}>
              <FaMapMarkerAlt className="contact-icon" />
              <h3>Location</h3>
              <p>Kirindiwela, Gampaha, Sri Lanka</p>
            </div>

            <div className="contact-map slide-reveal slide-left" style={{ "--reveal-delay": "220ms" }}>
              <iframe
                title="Ruhunu Yoghurt location map"
                src="https://maps.google.com/maps?q=Kirindiwela%20Gampaha%20Sri%20Lanka&t=&z=13&ie=UTF8&iwloc=&output=embed"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              />
            </div>
          </div>

          <div className="contact-form slide-reveal slide-right">
            <h3>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
              <input type="text" name="title" placeholder="Message Title" value={formData.title} onChange={handleChange} required />
              <textarea
                name="description"
                rows="4"
                placeholder="Tell us what you need..."
                value={formData.description}
                onChange={handleChange}
                required
              />
              <button type="submit" className="contact-btn">Submit Message</button>
            </form>
          </div>
        </div>
      </section>

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
              <li><button type="button" onClick={() => scrollToSection("hero")}>Home</button></li>
              <li><button type="button" onClick={() => navigate("/products")}>Products</button></li>
              <li><button type="button" onClick={() => scrollToSection("about")}>About Us</button></li>
              <li><button type="button" onClick={() => scrollToSection("contact")}>Contact</button></li>
            </ul>
          </div>

          <div className="footer-right slide-reveal slide-right" style={{ "--reveal-delay": "160ms" }}>
            <h4>Contact Us</h4>
            <p><FaMapMarkerAlt /> Kirindiwela, Gampaha, Sri Lanka</p>
            <p><FaPhone /> 076-215-7137</p>
            <p><FaEnvelope /> itpdairyproduct@gmail.com</p>
            <form
              className="newsletter-form"
              onSubmit={(event) => {
                event.preventDefault();
                toast.success("Thanks for subscribing to Ruhunu updates.");
              }}
            >
              <input type="email" placeholder="Subscribe to our newsletter" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright 2026 Ruhunu Yoghurt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
