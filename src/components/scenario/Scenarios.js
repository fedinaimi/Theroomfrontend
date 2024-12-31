import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Scenarios.css";
import Button from "../button/Button";
import { getAllChapters } from "../../services/chapterService";

function Scenarios() {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.43:5000';
  const constructURL = (path) => {
    if (!path) return "";
    return `${baseURL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  };
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", handleResize);

    async function fetchScenarios() {
      try {
        const fetchedScenarios = await getAllChapters();
        setScenarios(fetchedScenarios);
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      }
    }

    fetchScenarios();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderPercentageBadge = (percentage) => (
    <div className="percentage-badge">
      {percentage}% Success Rate
    </div>
  );

  if (isMobile) {
    return (
      <div className="mobile-scenarios">
        {scenarios.map((scenario) => (
          <section key={scenario._id} className="mobile-video-section">
            <video
              className="mobile-video"
              autoPlay
              loop
              muted
              playsInline
             src={constructURL(scenario.video)}
            >
              Your browser does not support the video tag.
            </video>
            <div className="mobile-video-overlay">
              <h2>
                {scenario.name}
                {renderPercentageBadge(scenario.percentageOfSuccess)}
              </h2>
              <p>{scenario.description}</p>
              <button
                className="cta-button"
                onClick={() =>
                  navigate(`/scenarios/${scenario._id}`, { state: scenario })
                }
              >
                En savoir plus →
              </button>
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="scenarios-section">
      <h2>Consultez nos scénarios !</h2>
      <div className="scenarios-container">
        {scenarios.map((scenario) => (
          <div className="scenario-card" key={scenario._id}>
            <div className="scenario-image-wrapper">
            
              <img src={constructURL(scenario.image)} alt={scenario.name} />
            </div>
            <div className="scenario-info">
              <div className="header-with-badge">
                <h3>{scenario.name}</h3>
                {renderPercentageBadge(scenario.percentageOfSuccess)}
              </div>
              <p className="scenario-description">{scenario.description}</p>
              <Button
                text="En savoir plus →"
                onClick={() =>
                  navigate(`/scenarios/${scenario._id}`, { state: scenario })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scenarios;
