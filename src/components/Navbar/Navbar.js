import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logoEscapeF.png";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isHome = location.pathname === "/";

  return (
    <div>
      {/* Hamburger Menu */}
      <div className={`hamburger ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Navbar for large screens */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="The Room Escape Game" />
          </Link>
        </div>
        <ul className="nav-links">
          {isHome ? (
            <>
              <li>
                <a href="#accueil">Accueil</a>
              </li>
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
            </>
          ) : (
            <>
              <li>
                <Link to="/#accueil">Accueil</Link>
              </li>
              <li>
                <Link to="/#scenarios-section">Scénarios</Link>
              </li>
            
              <li>
                <Link to="/#teambuilding">Teambuilding</Link>
              </li>
              <li>
                <Link to="/#apropos">À propos</Link>
              </li>
              <li>
                <Link to="/#contact">Contact</Link>
              </li>
            </>
          )}
        </ul>
        <div className="buttons">
          <Link to="/#reservation">
            <button className="reserve-btn">Réserver Maintenant</button>
          </Link>
        </div>
      </nav>

     {/* Sidebar */}
     <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <button className="close-btn" onClick={closeSidebar}>
          
        </button>
        <ul className="sidebar-links">
          <li>
            <Link to="/#accueil" onClick={closeSidebar}>
              <span>Accueil</span>
            </Link>
          </li>
          <li>
            <Link to="/#scenarios-section" onClick={closeSidebar}>
              <span>Scénarios</span>
            </Link>
          </li>
          <li>
            <Link to="/#teambuilding" onClick={closeSidebar}>
              <span>Teambuilding</span>
            </Link>
          </li>
          <li>
            <Link to="/#pack-pricing" onClick={closeSidebar}>
              <span>Nos Tarifs</span>
            </Link>
          </li>
          <li>
            <Link to="/#apropos" onClick={closeSidebar}>
              <span>À propos</span>
            </Link>
          </li>
          <li>
            <Link to="/#contact" onClick={closeSidebar}>
              <span>Contact</span>
            </Link>
          </li>
          <li>
            <Link to="/#reservation" onClick={closeSidebar}>
              <span>Réservation</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Navbar;
