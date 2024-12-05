import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ScenarioDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faUsers, faBook } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function ScenarioDetails() {
  const { id } = useParams(); // Get chapter ID from URL
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChapter() {
      try {
        const response = await axios.get(`http://localhost:5000/api/chapters/${id}`);
        setChapter(response.data); // Set chapter details
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

  // Determine difficulty and its color
  const difficulty = chapter?.difficulty || "unknown";
  const difficultyColor =
    difficulty === "easy" ? "green" : difficulty === "medium" ? "orange" : difficulty === "hard" ? "red" : "gray";

  return (
    <div className="cannibal-container_big">
      <h1 className="cannibal-title">{chapter.name || "Unknown Chapter"}</h1>
      <div className="escape-room">
        <img
          src={chapter.image || "/placeholder.jpg"}
          alt={chapter.name || "Chapter Image"}
          className="img"
        />
        <div className="details">
          <h2>Details</h2>
          <ul className="info-list">
            <li>
              <FontAwesomeIcon icon={faUsers} className="logo" />
              <strong>Players:</strong> {chapter.playerNumber || "Not specified"}
            </li>
            <li style={{ color: difficultyColor }}>
              ⭐ <strong>Difficulty:</strong> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </li>
            <li>
              <FontAwesomeIcon icon={faClock} className="logo" />
              <strong>Time:</strong> {chapter.time || "Not specified"} mins
            </li>
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="logo" />
              <strong>Location:</strong> {chapter.place || "Not specified"}
            </li>
            {chapter.description && (
              <li>
                <FontAwesomeIcon icon={faBook} className="logo" />
                <strong>Description:</strong> {chapter.description}
              </li>
            )}
          </ul>
          <div className="button-container">
            <button
              className="reserve-button"
              onClick={() =>
                navigate(`/reservation-details/${chapter._id}`, { state: { chapter } })
              }            >
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
