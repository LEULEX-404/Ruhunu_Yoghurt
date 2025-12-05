import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Home.css";
import "../Css/About.css";
import "../Css/services.css";
import "../Css/features.css";
import "../Css/contact.css";
import "../Css/hero.css";
import "../Css/navBar.css";
import "../Css/footer.css";
import { FaGlassWhiskey, FaCheese, FaIceCream, FaTruck, FaLeaf, FaCog, FaClock, FaRecycle, FaBox, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import sample1 from "../images/slider1.jpg";
import sample2 from "../images/slider4.jpg";
import sample3 from "../images/slider3.jpg";
import logo from "../images/mainLogo.png";

function Home() {

  const navigate = useNavigate();

  const [showMore, setShowMore] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
  });

  const [current, setCurrent] = useState(0);

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted! (You can connect backend later)");
  };
  
  const sections = [
    { id: "hero", name: "Home" },
    { id: "about", name: "About" },
    { id: "services", name: "Services" },
    { id: "features", name: "Features" },
    { id: "contact", name: "Contact" },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };


  const slides = [
    {
      title: "Streamline Dairy Operations",
      text: "Our system helps you manage milk, yogurt, cheese, and more with efficiency and accuracy.",
      image: sample1,
      btn: "Learn More",
    },
    {
      title: "Track Production & Inventory",
      text: "Monitor daily production and maintain accurate stock levels with ease.",
      image: sample2,
      btn: "View Features",
    },
    {
      title: "Deliver Quality, On Time",
      text: "Ensure fresh dairy products reach customers quickly and safely with smart logistics.",
      image: sample3,
      btn: "Get Started",
    },
  ];

  const services = [
    {
      title: "Milk Management",
      icon: <FaGlassWhiskey />,
      desc: "Track milk production and supply with real-time accuracy.",
      more: "Monitor sources, volumes, and distribution channels with ease.",
    },
    {
      title: "Cheese & Yogurt",
      icon: <FaCheese />,
      desc: "Manage cheese and yogurt processing efficiently.",
      more: "Maintain product quality, batch records, and stock levels automatically.",
    },
    {
      title: "Product Quality",
      icon: <FaIceCream />,
      desc: "Ensure hygiene and freshness of all dairy products.",
      more: "Every product is monitored for safety, quality, and compliance.",
    },
    {
      title: "Distribution",
      icon: <FaTruck />,
      desc: "Control supply chain and deliveries effectively.",
      more: "Track vehicles, routes, and delivery timelines for maximum efficiency.",
    },
    {
      title: "Eco-Friendly Dairy",
      icon: <FaLeaf />,
      desc: "Support sustainable and green dairy practices.",
      more: "Use eco-friendly packaging and reduce waste in operations.",
    },
    {
      title: "System Automation",
      icon: <FaCog />,
      desc: "Automate processes for better efficiency.",
      more: "Save time and reduce manual errors in daily operations.",
    },
  ]


  const features = [
    {
      title: "Real-Time Tracking",
      icon: <FaClock />,
      desc: "Monitor dairy product flow instantly from production to delivery.",
    },
    {
      title: "Smart Analytics",
      icon: <FaRecycle  />,
      desc: "Get detailed reports on sales, expenses, and product efficiency.",
    },
    {
      title: "Secure Records",
      icon: <FaBox  />,
      desc: "All data is stored securely for future reference and compliance.",
    },
    {
      title: "Customer Trust",
      icon: <FaLeaf  />,
      desc: "Build trust by delivering high-quality dairy products on time.",
    },
  ];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  }

  return (
          <div className="home-page">
            <nav className="navbar">
              <div className="navbar-left">
                <img src={logo} alt="Logo" className="navbar-logo" />
              </div>

              <ul className="navbar-center">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <button
                    onClick={() => scrollToSection(sec.id)}>{sec.name}</button>
                  </li>
                ))}
              </ul>
              
              <div className="navbar-right">
                <button className="login-btn" 
                onClick={() => navigate("/login")}>Login</button>

                <button className="signup-btn"
                onClick={() => navigate("/login")}>Sign Up</button>
              </div>
            </nav>


            <section
            id="hero"
            className="hero-static"
            style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}
            >
            <div className="slides-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>
              {slides.map((slide, index) => (
                <div key={index} className="hero-slide">
                  <div className="hero-content-static">
                    <div className="hero-text-static">
                      <h1>{slide.title}</h1>
                      <p>{slide.text}</p>
                      <button className="hero-btn-static">{slide.btn}</button>
                    </div>
                    <div className="hero-image-static">
                      <img src={slide.image} alt={slide.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="prev-btn" onClick={prevSlide}>&lt;</button>
            <button className="next-btn" onClick={nextSlide}>&gt;</button>
            
            <div className="hero-waves">

            <svg className="waves wave1" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
              <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
              </defs>
              <g className="parallax">
                <use href="#gentle-wave" x="48" y="0" fill="rgba(245,246,250,0.7)"></use>
              </g>
            </svg>

            <svg className="waves wave2" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
              <defs>
                <path id="gentle-wave-2" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
              </defs>
              <g className="parallax">
                <use href="#gentle-wave-2" x="48" y="0" fill="rgba(245,246,250,0.5)"></use>
              </g>
            </svg>

            <svg className="waves wave3" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
              <defs>
                <path id="gentle-wave-2" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
              </defs>
              <g className="parallax">
                <use href="#gentle-wave-2" x="48" y="0" fill="rgba(245,246,250,0.5)"></use>
              </g>
            </svg>
            </div>
          </section>
            
          <section id="about" className="aboutpage-section">
            <div className="aboutpage-container">
              <h2 className="aboutpage-title">About Our System</h2>
              <p className="aboutpage-text">
              We provide a <span>smart Dairy Product Management System</span> that
            helps producers, distributors, and retailers manage their operations
            efficiently.
              </p>

              {showMore && (
                <div className="aboutpage-more">
                  <p>
                  Our official system ensures <b>accuracy, freshness, and trust</b>.
                From production to delivery, we maintain high standards of
                hygiene and quality in every stage of dairy management.
                  </p>
                </div>
              )}
              <button
                className="aboutpage-btn"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show Less" : "Read More"}
              </button>

              <button className="aboutpage-btn secondary" onClick={() => setShowPopup(true)}>
                Learn More
              </button>

              {showPopup && (
                <div className="aboutpage-popup">
                  <div className="aboutpage-popup-content">
                    <h3>Why Choose Us?</h3>
                    <ul>
                      <li>✅ Real-time Product Tracking</li>
                      <li>✅ Automated Reports & Insights</li>
                      <li>✅ Secure and Reliable Records</li>
                      <li>✅ Timely Distribution Management</li>
                    </ul>
                    <button
                      className="aboutpage-close"
                      onClick={() => setShowPopup(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section id="services" className="servicespage-section">
          <h2 className="servicespage-title">Our Services</h2>
          <p className="servicespage-subtext">
          Efficient dairy management, from production to delivery.
          </p>

          <div className="servicespage-grid">
            {services.map((service, index) => (
              <div key={index} className="servicespage-card">
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
        <h2 className="features-title">Our Features</h2>
        <p className="features-subtext">
        Real-time tracking, automation, and secure record management.
        </p>

        <div className="features-timeline">
          {features.map((feature, index) => (
            <div key={index} className={`features-item ${index % 2 === 0 ? "left" : "right"}`}>
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
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtext">
        Have a question or need system support? Reach out to us anytime.
        </p>

        <div className="contact-container">

          <div className="contact-info">
            <div className="contact-card">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <p>itpdairyproduct@gmail.com</p>
            </div>

            <div className="contact-card">
              <FaPhone className="contact-icon" />
              <h3>Phone</h3>
              <p>076-215-7137</p>
            </div>

            <div className="contact-card">
              <FaMapMarkerAlt className="contact-icon" />
              <h3>Location</h3>
              <p>kirindiwela, Gamapaha, Sri Lanka</p>
            </div>

            <div className="contact-map">
              <iframe
                title="map"
                src="https://maps.google.com/maps?q=Colombo&t=&z=13&ie=UTF8&iwloc=&output=embed"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>

          <div className="contact-form">
            <h3>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Message Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                rows="4"
                placeholder="Describe your issue..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
              <button type="submit" className="contact-btn">
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer">
      <div className="footer-container">

        <div className="footer-left">
          <img src={logo} alt="Simple Dairy Logo" className="footer-logo" />
          <p>Our Dairy Product Management System ensures efficiency, accuracy,
              and quality from production to delivery.</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        <div className="footer-middle">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Products</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="footer-right">
            <h4>Contact Us</h4>
            <p><i className="fas fa-map-marker-alt"></i>kirindiwela, Gamapaha, Sri Lanka</p>
            <p><i className="fas fa-phone"></i> 076-215-7137</p>
            <p><i className="fas fa-envelope"></i> itpdairyproduct@gmail.com</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Subscribe to our newsletter" />
              <button>Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Dairy Product Management System. All Rights Reserved.</p>
        </div>
        </footer>
        </div>
    
    );
}

export default Home;
