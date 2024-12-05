import React, { useEffect } from "react";
import "./TeamBuilding.css";

function TeamBuilding() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate");
      const windowHeight = window.innerHeight;

      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight * 0.85) {
          element.classList.add("in-view");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="team-building-section">
      <div className="team-building-content animate">
        <h2>
          <span className="argent-text">Team Building</span> chez The Room
        </h2>
        <p>
          Renforcez la cohésion de votre équipe avec une expérience immersive.
          Nos escape rooms favorisent la communication, la collaboration et la
          résolution de problèmes dans un cadre ludique et stimulant. Un moment
          inoubliable pour développer l'esprit d'équipe !
        </p>
      </div>
      <div className="team-building-image animate">
        <iframe
          src="https://www.instagram.com/the_room_escape_game/embed"
          width="400"
          height="480"
          frameBorder="0"
          scrolling="no"
          allowTransparency="true"
          allow="encrypted-media"
          style={{
            borderRadius: "15px",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.6)",
          }}
        ></iframe>
      </div>
    </section>
  );
}

export default TeamBuilding;
