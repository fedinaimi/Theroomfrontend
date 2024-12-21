// src/components/Hero/Hero.js

import React from "react";
import "./Hero.css";
import logo from "../../assets/logoEscapeF.png";
import { FaArrowDown } from "react-icons/fa"; // Import de l'icône flèche vers le bas

function Hero({ onArrowClick }) {
  return (
    <div className="hero">
      <div className="floating-logo">
        <img src={logo} alt="The Room Escape Game" />
        <div className="scroll-arrow" onClick={onArrowClick}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {/* Nouvel Icône Cliquer Ici */}
        <div className="click-here-container" onClick={onArrowClick}>
         
          <span className="click-here-text">Cliquer ici</span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
