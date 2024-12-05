import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      {/* Hamburger Menu */}
      <div className={`hamburger ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <button className="close-btn" onClick={closeSidebar}>✖</button>
        <ul className="sidebar-links">
          <li><Link to="/#accueil" onClick={closeSidebar}>Accueil</Link></li>
          <li><Link to="/#scenarios-section" onClick={closeSidebar}>Scénarios</Link></li>
          <li><Link to="/#apropos" onClick={closeSidebar}>À propos</Link></li>
          <li><Link to="/#teambuilding" onClick={closeSidebar}>Teambuilding</Link></li>
          <li><Link to="/#contact" onClick={closeSidebar}>Contact</Link></li>
          <li><Link to="/#reservation" onClick={closeSidebar}>Réservation</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
