import React from "react";
import logo from "../images/logo.png";

const Navbar = ({ sections }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>

      <ul className="navbar-center">
        {sections.map((sec) => (
          <li key={sec.id}>
            <button onClick={() => scrollToSection(sec.id)}>{sec.name}</button>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
