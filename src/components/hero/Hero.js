// src/components/Hero/Hero.js

import React from "react";
import "./Hero.css";
import logo from "../../assets/logoEscapeF.png";

function Hero({ onArrowClick }) {
  return (
    <div className="hero">
      <div className="floating-logo">
        <img src={logo} alt="The Room Escape Game" />

        {/* Animated text block */}
        <p className="hero-text">
          Vivez une aventure immersive où chaque seconde compte ! Enfermés dans un décor captivant,
          résolvez des énigmes, trouvez des indices et travaillez en équipe pour vous échapper avant
          la fin du temps imparti. Prêts à relever le défi ?
          <br />
          {/* Make this text clickable */}
          <span 
            className="hero-highlight clickable-text" 
            onClick={onArrowClick}
          >
            Alors cliquez ici
          </span>
        </p>

        {/* Scroll Arrows */}
        <div 
          className="scroll-arrow" 
          onClick={onArrowClick} 
          aria-label="Scroll Down"
        >
          <span className="arrow"></span>
          <span className="arrow"></span>
          <span className="arrow"></span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
