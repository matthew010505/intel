import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div>
        <p style={styles.text}>© {new Date().getFullYear()} GovAid AI. All Rights Reserved.</p>
      </div>
      <nav style={styles.nav}>
        <a href="/privacy" style={styles.navLink}>Privacy Policy</a>
        <a href="/terms" style={styles.navLink}>Terms of Use</a>
      </nav>
    </footer>
  );
};

const styles = {
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#F3F3E0", // Light background
    color: "#133E87", // Deep blue text
    borderTop: "2px solid #CBDCEB", // Accent border
    marginTop: "auto",
  },
  text: {
    fontSize: "14px",
    fontFamily: "'Arial', sans-serif",
  },
  nav: {
    display: "flex",
    gap: "15px",
  },
  navLink: {
    color: "#133E87",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.3s",
  },
};

export default Footer;
