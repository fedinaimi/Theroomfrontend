// src/components/Hero/Hero.js

import React from "react";
import "./Hero.css";
import logo from "../../assets/logoEscapeF.png";

function Hero({ onArrowClick }) {
  return (
    <div className="hero">
      <div className="floating-logo">
        <img src={logo} alt="The Room Escape Game" />

        {/* Scroll Arrows */}
        <div className="scroll-arrow" onClick={onArrowClick} aria-label="Scroll Down">
          <span className="arrow"></span>
          <span className="arrow"></span>
          <span className="arrow"></span>
        </div>

        {/* "Cliquer ici" Button */}
        <button className="click-here-button" onClick={onArrowClick} aria-label="Click Here">
          Cliquer ici
        </button>
      </div>
    </div>
  );
}

export default Hero;
