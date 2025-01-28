import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logoEscapeF.png";

const Navbar = ({ onSidebarLinkClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Current route path
  const location = useLocation();
  // True if user is exactly on "/"
  const isHome = location.pathname === "/";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  /** Called when a sidebar link is clicked */
  const handleSidebarLink = () => {
    closeSidebar();

    // Also hide the Hero if we are on mobile & it's still shown
    if (onSidebarLinkClick) {
      onSidebarLinkClick();
    }
  };

  return (
    <div>
      {/* Hamburger Menu (mobile) */}
      <div className={`hamburger ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Desktop Navbar */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="The Room Escape Game" />
          </Link>
        </div>

        {/* Desktop links */}
        <ul className="nav-links">
          {/** Only show "Accueil" if isHome is true */}
          {isHome && (
            <li>
              <a href="#accueil">Accueil</a>
            </li>
          )}
          <li>
            <a href="#scenarios-section">Scénarios</a>
          </li>
          <li>
            <a href="#teambuilding">Teambuilding</a>
          </li>
          <li>
            <a href="#pack-pricing">Nos Tarifs</a>
          </li>
          <li>
            <a href="#apropos">À propos</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>

        {/* Example CTA button */}
        <div className="buttons">
          <Link to="/#reservation">
            <button className="reserve-btn">Réserver Maintenant</button>
          </Link>
        </div>
      </nav>

      {/* Sidebar (mobile) */}
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <button className="close-btn" onClick={closeSidebar}>
          ✕
        </button>
        <ul className="sidebar-links">
          {/* Only show Accueil in the sidebar if isHome == true */}
          {!isHome && (
            <li>
              <Link to="/#accueil" onClick={handleSidebarLink}>
                <span>Accueil</span>
              </Link>
            </li>
          )}
          <li>
            <Link to="/#scenarios-section" onClick={handleSidebarLink}>
              <span>Scénarios</span>
            </Link>
          </li>
          <li>
            <Link to="/#teambuilding" onClick={handleSidebarLink}>
              <span>Teambuilding</span>
            </Link>
          </li>
          <li>
            <Link to="/#pack-pricing" onClick={handleSidebarLink}>
              <span>Nos Tarifs</span>
            </Link>
          </li>
          <li>
            <Link to="/#apropos" onClick={handleSidebarLink}>
              <span>À propos</span>
            </Link>
          </li>
          <li>
            <Link to="/#contact" onClick={handleSidebarLink}>
              <span>Contact</span>
            </Link>
          </li>
          <li>
            <Link to="/#reservation" onClick={handleSidebarLink}>
              <span>Réservation</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
