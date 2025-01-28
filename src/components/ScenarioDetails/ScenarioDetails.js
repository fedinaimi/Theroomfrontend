import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faUsers, faBook } from "@fortawesome/free-solid-svg-icons";
import { getChapterById } from "../../services/chapterService";
import { getAllPrices } from "../../services/priceService"; // Import the price service
import "./ScenarioDetails.css";

function ScenarioDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successPercentage, setSuccessPercentage] = useState(0);
  const [prices, setPrices] = useState([]); // State to store prices

  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://192.168.1.43:5000";
  const constructURL = (path) => {
    if (!path) return "";
    return `${baseURL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedChapter, fetchedPrices] = await Promise.all([
          getChapterById(id),
          getAllPrices()
        ]);
        setChapter(fetchedChapter);
        setSuccessPercentage(fetchedChapter.percentageOfSuccess || 0);
        setPrices(fetchedPrices); // Set prices from API
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load chapter details.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading chapter details...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const imageURL = chapter.image ? constructURL(chapter.image) : "/placeholder.jpg";
  const difficulty = chapter?.difficulty || "unknown";
  const difficultyColor =
    difficulty === "easy"
      ? "green"
      : difficulty === "medium"
      ? "orange"
      : difficulty === "hard"
      ? "red"
      : "gray";

  return (
    <div className="cannibal-container_big">
      <h1 className="cannibal-title">{chapter.name || "Unknown Chapter"}</h1>
      <div className="escape-room">
        <img src={imageURL} alt={chapter.name || "Chapter Image"} className="img" />

        <div className="details">
          <h2>Details</h2>
          <ul className="info-list">
            <li>
              <FontAwesomeIcon icon={faUsers} className="logo" />
              <strong>Players:</strong> min: {chapter.minPlayerNumber} - max:{" "}
              {chapter.maxPlayerNumber || "Not specified"}
            </li>
            <li style={{ color: difficultyColor }}>
              ⭐ <strong>Difficulty:</strong>{" "}
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </li>
            <li>
              <FontAwesomeIcon icon={faClock} className="logo" />
              <strong>Time:</strong> {chapter.time || "Not specified"} mins
            </li>
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="logo" />
              <strong>Location:</strong>{" "}
              {chapter.place ? (
                <a
                  href={chapter.place}
                  className="location-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cliquez ici
                </a>
              ) : (
                "Not specified"
              )}
            </li>
            {chapter.description && (
              <li>
                <FontAwesomeIcon icon={faBook} className="logo" />
                <strong>Description:</strong> {chapter.description}
              </li>
            )}
          </ul>

          {/* Dynamic Prices */}
          <div className="price-line">
            {prices.map((price) => {
              const label = price.isAndAbove
                ? `${price.playersCount} Joueurs ou +`
                : `${price.playersCount} Joueurs`;
              return (
                <span key={price._id}>
                  {label}: <strong>{price.pricePerPerson} TND</strong> par personne
                  <span className="separator">|</span>
                </span>
              );
            })}
          </div>

          <div className="success-bar-container">
            <p className="success-text">
              <strong>Success Rate:</strong> {successPercentage}%
            </p>
            <div className="success-bar">
              <div
                className="success-bar-fill"
                style={{ width: `${successPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="button-container">
            <button
              className="reserve-button"
              onClick={() =>
                navigate(`/reservation-details/${chapter._id}`, {
                  state: { chapter },
                })
              }
            >
              Réserver Maintenant
            </button>
          </div>
        </div>
      </div>

      {chapter.comment && (
        <div className="textBottomcannibal">
          <p className="cannibal-description">{chapter.comment}</p>
        </div>
      )}
    </div>
  );
}

export default ScenarioDetails;
