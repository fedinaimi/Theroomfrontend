// src/components/Price.js
import React, { useState, useEffect } from "react";
import { getAllPrices } from "../../services/priceService";
import "./Price.css";

const Price = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const data = await getAllPrices();
      setPrices(data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  return (
    <section className="price-section">
      <h2 className="price-section-title">Nos Tarifs</h2>

      <div className="price-cards">
        {prices.map((price) => {
          // For example, if price.playersCount=2 and isAndAbove=false => "2 Joueurs"
          // if price.playersCount=4 and isAndAbove=true => "4 Joueurs ou +"
          const cardTitle = price.isAndAbove
            ? `${price.playersCount} Joueurs ou +`
            : `${price.playersCount} Joueurs`;

          return (
            <div key={price._id} className="price-card">
              <h3 className="price-card-title">{cardTitle}</h3>
              <p className="price-card-amount">{price.pricePerPerson} TND</p>
              <p className="price-card-per">par personne</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Price;
