import React from "react";
import "./Hero.css";
import logo from "../../assets/logoEscapeF.png";

function Hero() {
  const scrollToScenarios = () => {
    const section = document.getElementById("scenarios-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero">
      <div className="floating-logo">
        <img src={logo} alt="The Room Escape Game" />
        {/* Scroll arrow placed near the logo */}
        <div className="scroll-arrow" onClick={scrollToScenarios}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
