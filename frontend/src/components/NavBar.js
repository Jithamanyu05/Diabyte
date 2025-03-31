import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetUserState } from "../redux/slices/userslice";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUtensils, FaBrain, FaHeartbeat } from "react-icons/fa";
import "./NavBar.css"; // Import styles
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const { isLoggedIn, currentUser } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const SignOut = () => {
    localStorage.removeItem("token");
    dispatch(resetUserState());
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="navbar-glass-a py-3 ">
      <Container className="">
        {/* Brand Name with Glow Effect */}
        <Navbar.Brand as={NavLink} to="/" className="brand-glow fs-2 px-3 text-dark">
          DiaBite
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="mx-auto d-flex gap-4">
            <Nav.Link as={NavLink} to="/sugar-tracker" className="nav-link-glow">
              <FaHeartbeat className="me-1" /> Sugar Tracker
            </Nav.Link>
            <Nav.Link as={NavLink} to="/food-logging" className="nav-link-glow">
              <FaUtensils className="me-1" /> Food Logging
            </Nav.Link>
            <Nav.Link as={NavLink} to="/ai-recommendations" className="nav-link-glow">
              <FaBrain className="me-1" /> AI Recommendations
            </Nav.Link>
          </Nav>

          {/* Login / Logout Buttons */}
          <Nav>
            {isLoggedIn ? (
              <div className="d-flex align-items-center gap-3">
                <Nav.Link as={NavLink} to="/dashboard" className="nav-link-glow">
                   DashBoard
                </Nav.Link>
                <span className="welcome-text text-dark">
                  Welcome, <span className="highlight-text">{currentUser.name}</span>
                </span>
                <Button variant="danger" className="btn-neon border-0" onClick={SignOut}>
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </div>
            ) : (
              <Button as={NavLink} to="/signin" className="btn-neon border-0">
                <FaSignInAlt className="me-1" /> Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;