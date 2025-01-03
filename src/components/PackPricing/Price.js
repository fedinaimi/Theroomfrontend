import React from "react";
import "./Price.css";

const Price = () => {
  return (
    <section className="price-section">
      <h2 className="price-section-title">Nos Tarifs</h2>
      <div className="price-cards">
        {/* Card #1 */}
        <div className="price-card">
          <h3 className="price-card-title">2 Joueurs</h3>
          <p className="price-card-amount">40 TND</p>
          <p className="price-card-per">par personne</p>
        </div>

        {/* Card #2 */}
        <div className="price-card">
          <h3 className="price-card-title">3 Joueurs</h3>
          <p className="price-card-amount">35 TND</p>
          <p className="price-card-per">par personne</p>
        </div>

        {/* Card #3 with a "Best Value" badge */}
        <div className="price-card">
          <h3 className="price-card-title">4 Joueurs ou +</h3>
          <p className="price-card-amount">30 TND</p>
          <p className="price-card-per">par personne</p>
        </div>
      </div>
    </section>
  );
};

export default Price;
