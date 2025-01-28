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
       Bienvenue à The Room, votre destination d’aventure immersive à Menzah 7 !
        </p>
        <p>
        Plongez au cœur de nos escape rooms uniques, conçues pour offrir une expérience inoubliable. Que ce soit entre amis, en famille ou avec vos collègues, notre équipe s’engage à créer un environnement captivant où réflexion, coopération et amusement se rencontrent.

Chez The Room, chaque salle thématique est soigneusement imaginée pour vous transporter dans un univers fascinant. Que ce soit pour un team building, une fête d’anniversaire ou simplement une sortie originale, nous promettons des moments de défi et de divertissement qui resteront gravés dans vos mémoires.

Prêts à relever le défi ? Rejoignez-nous et découvrez une nouvelle façon de vous amuser !
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
