import React from "react";
import "./Hero.css";
import logo from "../../assets/logoEscapeF.png";

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
      </div>
    </div>
  );
}

export default Hero;
