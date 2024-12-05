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
        <h2>À propos de <span className="argent-text">THE ROOM</span></h2>
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3201.004015722391!2d10.194071315465232!3d36.84567147993738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3432b9bff445%3A0x2f01edec7d656f99!2sThe%20Room%20Escape%20Game!5e0!3m2!1sen!2stn!4v1679645251327!5m2!1sen!2stn"
          width="100%"
          height="300"
          style={{ border: "0", borderRadius: "10px" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}

export default About;
