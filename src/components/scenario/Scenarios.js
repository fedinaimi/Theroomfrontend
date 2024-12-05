import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Scenarios.css";
import Button from "../button/Button";
import { getAllChapters } from "../../services/chapterService";

function Scenarios() {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]); // Dynamic scenarios from backend
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", handleResize);

    // Fetch scenarios from backend on component mount
    async function fetchScenarios() {
      try {
        const fetchedScenarios = await getAllChapters();
        setScenarios(fetchedScenarios); // Update state with backend data
      } catch (error) {
        console.error("Error fetching scenarios:", error);
        setError("An error occurred while fetching scenarios. Please try again.");
      } finally {
        setIsLoading(false); // Stop loading spinner
      }
    }
    fetchScenarios();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <p>Loading scenarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="mobile-scenarios">
        {scenarios.map((scenario) => (
          <div key={scenario._id} className="mobile-video-section">
            <video
              className="mobile-video"
              autoPlay
              loop
              muted
              playsInline
              src={scenario.video}
              controls={false} // Ensure playback controls are hidden
            >
              Your browser does not support the video tag.
            </video>
            <div className="mobile-video-overlay">
              <h2>{scenario.name}</h2>
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
          </div>
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
              <img src={scenario.image} alt={scenario.name} className="scenario-image" />
            </div>
            <div className="scenario-info">
              <h3>{scenario.name}</h3>
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
