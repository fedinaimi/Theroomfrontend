import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  fetchChapterDetails,
  fetchTimeSlots,
  createReservation,
} from "../../services/reservationService";
import ButtonLoader from "../button/ButtonLoader";
import "./ReservationDetails.css";

function ReservationDetails() {
  const { id } = useParams(); // Get the chapter ID from URL params
  const { state } = useLocation(); // Get chapter data passed from ScenarioDetails

  const [chapter, setChapter] = useState(state?.chapter || null); // Use state or fallback to API
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+33", // Default country code
    people: 1,
    language: "en",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Chapter Details and Time Slots
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!chapter) {
          const fetchedChapter = await fetchChapterDetails(id);
          setChapter(fetchedChapter);
        }
        const formattedDate = currentDate.toISOString().split("T")[0];
        const fetchedTimeSlots = await fetchTimeSlots(id, formattedDate);
        setTimeSlots(
          fetchedTimeSlots.map((slot) => ({
            ...slot,
            isAvailable: slot.isAvailable,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id, chapter, currentDate]);

  const handleReserveClick = (slot) => {
    setSelectedTimeSlot(slot);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setFormData({ name: "", email: "", phone: "", countryCode: "+33", people: 1, language: "en" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reservationData = {
        scenario: chapter?.scenario?._id,
        chapter: chapter._id,
        timeSlot: selectedTimeSlot._id,
        phone: `${formData.countryCode}${formData.phone}`,
        ...formData,
      };
      await createReservation(reservationData);
      setTimeSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot._id === selectedTimeSlot._id ? { ...slot, isAvailable: false } : slot
        )
      );
      setIsPopupOpen(false);
      setSuccessMessage("Votre réservation a été confirmée. Un email sera envoyé.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error creating reservation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  const handlePrevDate = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDate);
  };

  const handleNextDate = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  return (
    <div className="reservation-container">
      <h1 className="reservation-title">{chapter?.name || "Réservation"}</h1>
      <div className="calendar-navigation">
        <button className="nav-button" onClick={handlePrevDate}>
          ◀
        </button>
        <span className="active-date">
          {currentDate.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <button className="nav-button" onClick={handleNextDate}>
          ▶
        </button>
      </div>
      <div className="reservation-card">
        <img
          src={chapter?.image || "/placeholder.jpg"}
          alt={chapter?.name || "Chapter"}
          className="reservation-image"
        />
        <p className="reservation-description">{chapter?.description || "No description available."}</p>
        <h3 className="availability-title">Disponibilités</h3>
        <div className="availability-list">
          {timeSlots.length === 0 ? (
            <p>Coming Soon</p>
          ) : (
            timeSlots.map((slot) => (
              <button
                key={slot._id}
                className={`time-slot ${slot.isAvailable ? "available" : "unavailable"}`}
                onClick={() => handleReserveClick(slot)}
                disabled={!slot.isAvailable}
              >
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </button>
            ))
          )}
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 className="popup-title">
              Réserver pour {formatTime(selectedTimeSlot?.startTime) || "N/A"}
            </h2>
            <form onSubmit={handleSubmit} className="popup-form">
              <label>Nom:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
              <label>Téléphone:</label>
              <div className="phone-input">
                <select
                  className="country-code"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                >
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+216">🇹🇳 +216</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+49">🇩🇪 +49</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Numéro de téléphone"
                  required
                />
              </div>
              <label>Nombre de personnes:</label>
              <input
                type="number"
                name="people"
                value={formData.people}
                onChange={handleFormChange}
                min="1"
                required
              />
              <label>Langue:</label>
              <select name="language" value={formData.language} onChange={handleFormChange}>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
              <div className="popup-buttons">
                <button type="submit" className="submit-button">
                  {isSubmitting ? <ButtonLoader /> : "Confirmer"}
                </button>
                <button type="button" className="cancel-button" onClick={handleClosePopup}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
}

export default ReservationDetails;
