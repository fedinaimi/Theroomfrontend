import React, { useEffect } from "react";
import "./About.css";

function About() {
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
    <section className="about-section">
      <div className="about-content animate">
        <h2>
          À propos de <span className="argent-text">THE ROOM</span>
        </h2>
        <p>
          Bienvenue à The Room! Nous sommes situés au cœur de Menzah 7, où nous
          proposons des expériences uniques sous forme d'escape rooms. Notre
          équipe est dédiée à offrir un environnement excitant et immersif où
          vous pouvez résoudre des énigmes et vous amuser avec vos amis ou votre
          famille.
        </p>
        <p>
          Notre établissement a été conçu pour offrir un mélange d'aventure, de
          défi et de divertissement. Nous sommes fiers de nos salles
          thématiques, parfaites pour des activités de team building, des fêtes
          d'anniversaire ou simplement une sortie amusante.
        </p>
      </div>
      <div className="about-map animate">
        <h3>Où vous pouvez nous trouver :</h3>
        <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.9994977956575!2d10.1689287!3d36.8536969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd33563fb1afad%3A0xd1e0353f2a6e4df9!2sThe%20Room%20Escape%20Game!5e0!3m2!1sen!2stn!4v1679645251327!5m2!1sen!2stn"
  width="100%"
  height="300"
  style={{ border: "0", borderRadius: "10px" }}
  allowFullScreen=""
  loading="lazy"
></iframe>

        <p style={{ marginTop: "10px" }}>
          Vous pouvez également nous trouver facilement via Google Maps sur votre
          téléphone. Cliquez sur ce bouton pour ouvrir directement l'application :
        </p>
        <a
          href="https://maps.app.goo.gl/ChLfGRuS6EiAfofS8"
          target="_blank"
          rel="noopener noreferrer"
          className="map-button"
        >
          <i className="fas fa-map-marker-alt"></i> Ouvrir dans Google Maps
        </a>
      </div>
    </section>
  );
}

export default About;
