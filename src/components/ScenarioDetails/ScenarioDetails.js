// src/pages/ScenarioDetails.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ScenarioDetails.css"; // same file containing .cannibal-container_big, etc.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faUsers, faBook } from "@fortawesome/free-solid-svg-icons";
import { getChapterById } from "../../services/chapterService";

function ScenarioDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successPercentage, setSuccessPercentage] = useState(0);

  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://192.168.1.43:5000";
  const constructURL = (path) => {
    if (!path) return "";
    return `${baseURL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    async function fetchChapter() {
      try {
        const fetchedChapter = await getChapterById(id);
        setChapter(fetchedChapter);
        setSuccessPercentage(fetchedChapter.percentageOfSuccess || 0);
      } catch (err) {
        console.error("Error fetching chapter:", err);
        setError("Failed to load chapter details.");
      } finally {
        setLoading(false);
      }
    }
    fetchChapter();
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
        {/* Chapter Image */}
        <img
          src={imageURL}
          alt={chapter.name || "Chapter Image"}
          className="img"
        />

        {/* Details */}
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

          {/* Single-line static prices */}
          <div className="price-line">
            <span>
              2 Joueurs: <strong>40 TND</strong> par personne
            </span>
            <span className="separator">|</span>
            <span>
              3 Joueurs: <strong>35 TND</strong> par personne
            </span>
            <span className="separator">|</span>
            <span>
              4 Joueurs ou +: <strong>30 TND</strong> par personne
            </span>
          </div>

          {/* Success Bar */}
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

          {/* Reserve Button */}
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

      {/* Comment / Additional Info */}
      {chapter.comment && (
        <div className="textBottomcannibal">
          <p className="cannibal-description">{chapter.comment}</p>
        </div>
      )}
    </div>
  );
}

export default ScenarioDetails;
