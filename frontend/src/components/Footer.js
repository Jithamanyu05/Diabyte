import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaHome, FaInfoCircle, FaPhoneAlt, FaLock } from "react-icons/fa";

function Footer() {
  // Container/Footer Styles
  const footerStyles = {
    padding: "2rem 0",
    fontFamily: "'Poppins', sans-serif",
    marginTop: "10rem",
    boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)", // Shadow only on the top
  };
  
  // Heading Style
  const headingStyle = {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#004085", // dark blue for contrast
    marginBottom: "1rem",
  };

  // Link Styles
  const linkStyle = {
    color: "#000000",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "color 0.3s ease, transform 0.2s",
    cursor: "pointer",
  };

  // Icon Styles
  const iconStyle = {
    fontSize: "1.6rem",
    color: "#495057",
    transition: "transform 0.3s ease, color 0.3s ease",
    cursor: "pointer",
  };

  return (
    <footer style={footerStyles}>
      <Container>
        <Row className="text-center text-md-start">
          {/* Left Section - Quick Links */}
          <Col xs={12} md={4} className="mb-3">
            <h5 style={headingStyle}>Quick Links</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[" 🏠 Home", "ℹ️ About", "📞 Contact", "🔒 Privacy Policy"].map(
                (text, index) => (
                  <li key={index} style={{ marginBottom: "0.5rem" }}>
                    <a
                      href="/"
                      style={linkStyle}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#007bff";
                        e.target.style.transform = "translateX(5px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = linkStyle.color;
                        e.target.style.transform = "none";
                      }}
                    >
                      {text}
                    </a>
                  </li>
                )
              )}
            </ul>
          </Col>

          {/* Center Section - Social Media */}
          <Col xs={12} md={4} className="mb-3 text-center">
            <h5 style={headingStyle}>Follow Us</h5>
            <div className="d-flex justify-content-center gap-3">
              {[
                { icon: <FaGithub />, link: "https://github.com/" },
                { icon: <FaLinkedin />, link: "https://linkedin.com/" },
                { icon: <FaTwitter />, link: "https://twitter.com/" },
                { icon: <FaInstagram />, link: "https://instagram.com/" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={iconStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.2)";
                    e.target.style.color = "#007bff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.color = iconStyle.color;
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>

          {/* Right Section - Copyright */}
          <Col xs={12} md={4} className="text-center text-md-end">
            <h5 style={headingStyle}>© {new Date().getFullYear()} DiaBite</h5>
            <p style={{ fontSize: "0.9rem", color: "#6c757d", margin: 0 }}>
              Empowering Health, One Bite at a Time.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
