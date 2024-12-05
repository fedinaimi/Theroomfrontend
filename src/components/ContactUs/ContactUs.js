import React from "react";
import "./ContactUs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

const ContactUs = () => {
  return (
    <section className="contact-section">
      <div className="contact-header">
        <FontAwesomeIcon icon={faPhone} className="phone-icon" />
        <h2>Contactez-nous</h2>
      </div>
      <div className="contact-content">
        <p>
          Nous sommes heureux de vous aider ! Suivez-nous sur les réseaux sociaux pour rester informé de nos dernières nouvelles et événements.
          N'hésitez pas à nous contacter pour toute question ou demande d'information.
        </p>
      </div>
      <div className="contact-links">
        <a
          href="https://www.facebook.com/theroomescapegame"
          target="_blank"
          rel="noopener noreferrer"
          className="link-item"
          title="Facebook"
        >
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a
          href="https://www.instagram.com/the_room_escape_game/"
          target="_blank"
          rel="noopener noreferrer"
          className="link-item"
          title="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="mailto:info@escapium.com"
          className="link-item"
          title="Email"
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
        <a
          href="tel:+21625499810"
          className="link-item"
          title="Phone"
        >
          <FontAwesomeIcon icon={faPhone} />
        </a>
      </div>
    </section>
  );
};

export default ContactUs;
