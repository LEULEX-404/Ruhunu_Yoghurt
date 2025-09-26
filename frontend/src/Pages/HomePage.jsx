import React from "react";
import "../Css/Home.css";
import heroImage from "./bg-shap.jpg";

function Home() {
  const sections = [
    { id: "hero", name: "Home" },
    { id: "about", name: "About" },
    { id: "services", name: "Services" },
    { id: "features", name: "Features" },
    { id: "pricing", name: "Pricing" },
    { id: "contact", name: "Contact" },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <ul>
          {sections.map((sec) => (
            <li key={sec.id}>
              <button onClick={() => scrollToSection(sec.id)}>{sec.name}</button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sections */}
      {/* Hero Section */}
      <section
        id="hero"
        className="section hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-content">
          <h1 className="fade-in">Get a Fully Branded Mobile App</h1>
          <p className="fade-in delay-1">
            For your Business and Customer. Simple Dairy App with your brand
            name (White label) and more features.
          </p>
          <button className="hero-btn fade-in delay-2">Contact Us</button>
        </div>
      </section>

      <section id="about" className="section about">
        <h2>About Us</h2>
        <p>We provide fresh dairy products daily to your doorstep.</p>
      </section>

      <section id="services" className="section services">
        <h2>Our Services</h2>
        <p>Milk, yogurt, cheese, and other dairy essentials delivered fresh.</p>
      </section>

      <section id="features" className="section features">
        <h2>Features</h2>
        <p>Farm fresh products, timely delivery, and eco-friendly packaging.</p>
      </section>

      <section id="pricing" className="section pricing">
        <h2>Pricing</h2>
        <p>Affordable rates for high-quality dairy products.</p>
      </section>

      <section id="contact" className="section contact">
        <h2>Contact Us</h2>
        <p>Email: info@simpledairy.com | Phone: 012-3456789</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Simple Dairy. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
