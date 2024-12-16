import React from "react";
import { useLocation } from "react-router-dom";
import Header from './Header'
import Footer from './Footer'
const CardNavigation = () => {
  // Array containing card names and external links
  const location = useLocation();
  const cards= location.state?.data;
  // const cards = [
  //   { title: "Stocks and IPO", link: "https://example.com/stocks-ipo" },
  //   { title: "Futures & Options", link: "https://example.com/futures-options" },
  //   { title: "Mutual Funds & ETF", link: "https://example.com/mutual-funds-etf" },
  //   { title: "Currency & Commodity", link: "https://example.com/currency-commodity" },
  //   { title: "StockCase", link: "https://example.com/stockcase" },
  //   { title: "Global Investing", link: "https://example.com/global-investing" },
  // ];

  return (
    <>
    <Header/>
    <div style={styles.container}>
      {cards.map((card, index) => (
        <a
          key={index}
          href={card.url}
          style={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div style={styles.iconWrapper}>
            <div style={styles.icon}></div>
          </div>
          <p style={styles.cardTitle}>{card.scheme_name}</p>
        </a>
      ))}
    </div>
    <Footer/>
    </>
  );
};

// Inline styles with the requested color palette
const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#F3F3E0", // Light background
  },
  card: {
    backgroundColor: "#CBDCEB", // Soft blue-gray for the card background
    borderRadius: "10px",
    padding: "20px",
    color: "#133E87", // Deep blue for text
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textDecoration: "none", // Remove underline for links
    fontFamily: "'Arial', sans-serif",
  },
  cardTitle: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "500",
    textAlign: "center",
  },
  iconWrapper: {
    width: "50px",
    height: "50px",
    backgroundColor: "#608BC1", // Accent blue for icon background
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: "20px",
    height: "20px",
    backgroundColor: "#133E87", // Deep blue for icon
    borderRadius: "50%",
  },
};

export default CardNavigation;
