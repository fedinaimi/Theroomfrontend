// src/components/ReservationDetails/ReservationDetails.js

import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  fetchChapterDetails,
  fetchTimeSlots,
  createReservation,
} from "../../services/reservationService";
import "./ReservationDetails.css";
import { FaPhoneAlt } from "react-icons/fa"; // Import the phone icon
import ButtonLoader from "../button/ButtonLoader";
import countryCodes from "../../data/countryCodes.json";

function ReservationDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  const [chapter, setChapter] = useState(state?.chapter || null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+216",
    people: 1,
    language: "fr",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis.";
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Adresse email invalide.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis.";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Le numéro de téléphone doit contenir uniquement des chiffres.";
    }
    if (chapter) {
      const { minPlayerNumber, maxPlayerNumber } = chapter;
      const playerCount = Number(formData.people);

      if (isNaN(playerCount) || playerCount < minPlayerNumber || playerCount > maxPlayerNumber) {
        newErrors.people = `Le nombre de joueurs doit être entre ${minPlayerNumber} et ${maxPlayerNumber}.`;
      }
    }
    return newErrors;
  };

  // Fetch chapter details only once when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!chapter) {
          const fetchedChapter = await fetchChapterDetails(id);
          setChapter(fetchedChapter);
        }
        await loadTimeSlots(currentDate); // Load time slots for the current date
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, chapter]);

  // Dynamically fetch time slots whenever the date changes
  useEffect(() => {
    loadTimeSlots(currentDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const loadTimeSlots = async (date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const fetchedTimeSlots = await fetchTimeSlots(id, formattedDate);

      const now = new Date();
      const filteredTimeSlots = fetchedTimeSlots.filter((slot) => {
        const slotTime = new Date(slot.startTime);
        return date.toDateString() !== now.toDateString() || slotTime > now;
      });

      // Sort slots by start time
      filteredTimeSlots.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

      // Identify the next immediate slot (n+1)
      const nextSlot = filteredTimeSlots.find((slot) => {
        const slotTime = new Date(slot.startTime);
        const diffInHours = (slotTime - now) / (1000 * 60 * 60);
        return diffInHours >= 0;
      });

      // Map slots and mark the next slot
      const mappedSlots = filteredTimeSlots.map((slot) => ({
        ...slot,
        isNext: nextSlot ? slot._id === nextSlot._id : false,
      }));

      setTimeSlots(mappedSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]); // Reset time slots if an error occurs
    }
  };

  const handlePrevDate = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    if (prevDate >= new Date().setHours(0, 0, 0, 0)) {
      setCurrentDate(prevDate);
    }
  };

  const handleNextDate = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate >= new Date().setHours(0, 0, 0, 0)) {
      setCurrentDate(selectedDate);
    }
  };

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setErrorMessage("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const reservationData = {
        scenario: chapter?.scenario?._id,
        chapter: chapter._id,
        timeSlot: selectedTimeSlot._id,
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`,
        people: formData.people,
        language: formData.language,
      };

      await createReservation(reservationData);

      // Refresh time slots after reservation
      await loadTimeSlots(currentDate);

      setSuccessMessage("Votre réservation est en cours de traitement. Attendez notre confirmation.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error creating reservation:", error.message);
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  const formatDisplayDate = (date) =>
    date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatPhoneNumber = (phone) => `tel:${phone}`;

  return (
    <div className="reservation-container">
      <h1 className="reservation-title">{chapter?.name || "Réservation"}</h1>
      <div className="calendar-navigation">
        <button className="nav-button" onClick={handlePrevDate}>
          ◀
        </button>
        <input
          type="date"
          className="date-picker"
          value={currentDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
        />
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
        <h3 className="availability-title">Disponibilités</h3>
        <div className="availability-list">
          {timeSlots.length === 0 ? (
            <p className="no-availability">Pas de date disponible</p>
          ) : (
            timeSlots.map((slot) => (
              slot.isNext ? (
                <a
                  key={slot._id}
                  href={formatPhoneNumber("+21625499810")} // Replace with your desired phone number
                  className="time-slot phone-slot"
                >
                  <FaPhoneAlt className="phone-icon" /> {formatTime(slot.startTime)}
                </a>
              ) : (
                <button
                  key={slot._id}
                  className={`time-slot ${slot.status}`} // Dynamically add class based on status
                  onClick={() => handleReserveClick(slot)}
                  disabled={slot.status !== "available"} // Only allow clicks for "available" slots
                >
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </button>
              )
            ))
          )}
        </div>
      </div>

      {/* Reservation Popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 className="popup-title">
              Réserver pour {formatTime(selectedTimeSlot?.startTime) || "N/A"}
            </h2>
            <form onSubmit={handleSubmit} className="popup-form">
              {/* Name Field */}
              <label>Nom:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Entrez votre nom"
                className={errors.name ? "input-error" : ""}
                required
              />
              {errors.name && <p className="error-message">{errors.name}</p>}

              {/* Email Field */}
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Entrez votre adresse email"
                className={errors.email ? "input-error" : ""}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}

              {/* Phone Field */}
              <label>Téléphone:</label>
              <div className="phone-input">
                <select
                  className="country-code"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.dialCode}>
                      {country.flag} {country.name} ({country.dialCode})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Numéro de téléphone"
                  className={errors.phone ? "input-error" : ""}
                  required
                />
              </div>
              {errors.phone && <p className="error-message">{errors.phone}</p>}

              {/* Number of Players Field */}
              <label>Nombre de personnes:</label>
              <input
                type="number"
                name="people"
                value={formData.people}
                onChange={handleFormChange}
                placeholder="Nombre de participants"
                min={chapter?.minPlayerNumber || 1}
                max={chapter?.maxPlayerNumber || 10}
                className={errors.people ? "input-error" : ""}
                required
              />
              {errors.people && <p className="error-message">{errors.people}</p>}

              {/* Language Field */}
              <label>Langue:</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleFormChange}
                required
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>

              {/* Form Buttons */}
              <div className="popup-buttons">
                <button type="submit" className="submit-button" disabled={isSubmitting}>
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

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <p className="success-message-text">
            Votre réservation est en cours de traitement.<br />Attendez notre confirmation.
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="error-message-container">
          <p className="error-message-text">{errorMessage}</p>
        </div>
      )}

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <span className="legend-color pending"></span>
          <span>En attente</span>
        </div>
        <div className="legend-item">
          <span className="legend-color booked"></span>
          <span>Réservé</span>
        </div>
      </div>
    </div>
  );
}

export default ReservationDetails;
