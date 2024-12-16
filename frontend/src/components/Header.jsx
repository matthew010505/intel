// Header.js
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>GovAid AI</h1>
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>
          Home
        </Link>
        <Link to="/about" style={styles.navLink}>
          About
        </Link>
        <Link to="/contact" style={styles.navLink}>
          Contact
        </Link>
        <Link to="/services" style={styles.navLink}>
          Services
        </Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#133E87", // Deep blue background
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    color: "#F3F3E0", // Light color for the logo text
    fontSize: "24px",
    fontWeight: "bold",
    fontFamily: "'Arial', sans-serif",
  },
  nav: {
    display: "flex",
    gap: "15px",
  },
  navLink: {
    color: "#CBDCEB", // Soft blue-gray for links
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  navLinkHover: {
    color: "#F3F3E0", // Hover color for links
  },
};

export default Header;
