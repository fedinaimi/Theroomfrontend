// src/components/Reservation/Reservation.js

import React, { useState, useEffect } from "react";
import {
  fetchChapters,
  fetchTimeSlots,
  createReservation,
} from "../../services/reservationService";
import "./Reservation.css";
import { FaPhoneAlt } from "react-icons/fa"; // Import phone icon
import ButtonLoader from "../button/ButtonLoader";
import countryCodes from "../../data/countryCodes.json";

const Reservation = () => {
  const [chapters, setChapters] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+216",
    people: 1,
    language: "fr",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Function to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Fetch chapters on mount
  useEffect(() => {
    const loadChapters = async () => {
      try {
        const fetchedChapters = await fetchChapters();
        setChapters(fetchedChapters);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };
    loadChapters();
  }, []);

  // Fetch time slots based on the current date and chapters
  const loadTimeSlotsForDate = async (date) => {
    if (chapters.length === 0) return;

    const formattedDate = date.toISOString().split("T")[0];
    const slots = {};

    const today = isToday(date);

    for (const chapter of chapters) {
      try {
        const chapterTimeSlots = await fetchTimeSlots(chapter._id, formattedDate);

        const now = new Date();
        const filteredSlots = chapterTimeSlots.filter((slot) => {
          const slotTime = new Date(slot.startTime);
          return today ? slotTime >= now : true; // If today, filter past slots
        });

        // Sort slots by start time
        filteredSlots.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        let nextSlotId = null;

        if (today) {
          // Identify the next available slot for today
          const nextSlot = filteredSlots.find((slot) => {
            const slotTime = new Date(slot.startTime);
            return slotTime >= now;
          });
          nextSlotId = nextSlot ? nextSlot._id : null;
        }

        // Map slots and mark the next slot only for today
        slots[chapter._id] = filteredSlots.map((slot) => ({
          ...slot,
          isNext: today && slot._id === nextSlotId, // isNext only for today
        }));
      } catch (error) {
        console.error(`Error fetching slots for chapter ${chapter._id}:`, error);
        slots[chapter._id] = [];
      }
    }
    setTimeSlots(slots);
  };

  useEffect(() => {
    loadTimeSlotsForDate(currentDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters, currentDate]);

  // Navigate to next or previous day
  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));

    const today = new Date();
    // Ensure the new date is today or later
    if (newDate >= today.setHours(0, 0, 0, 0)) {
      setCurrentDate(newDate);
    }
  };

  // Select a specific date
  const handleDateSelect = (e) => {
    const selectedDate = new Date(e.target.value);
    if (isNaN(selectedDate)) return; // Check if the date is valid
    if (selectedDate >= new Date().setHours(0, 0, 0, 0)) {
      setCurrentDate(selectedDate);
    }
  };

  // Open reservation popup
  const handleOpenPopup = (chapter, timeSlot) => {
    setSelectedChapter(chapter);
    setSelectedTimeSlot(timeSlot);
    setIsPopupOpen(true);
  };

  // Close reservation popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      countryCode: "+216",
      people: 1,
      language: "en",
    });
    setErrors({});
    setErrorMessage("");
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setErrorMessage(""); // Clear previous errors

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const reservationData = {
        scenario: selectedChapter?.scenario?._id,
        chapter: selectedChapter._id,
        timeSlot: selectedTimeSlot._id,
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`,
        people: formData.people,
        language: formData.language,
      };

      await createReservation(reservationData);

      setIsPopupOpen(false);
      setIsSuccessMessageVisible(true);
      // Removed setTimeout to prevent auto-dismissal

      // Refresh time slots
      await loadTimeSlotsForDate(currentDate);
    } catch (error) {
      console.error(
        "Error creating reservation:",
        error.message || error
      );
      setErrorMessage(
        error.message || "Erreur lors de la création de la réservation."
      ); // Display backend error message
      // Removed setTimeout to prevent auto-dismissal
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis.";
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Adresse email invalide.";
    }
    if (formData.phone.length !== 8) {
      newErrors.phone = "Le numéro de téléphone doit contenir exactement 8 chiffres.";
    } else if (!/^[9254]/.test(formData.phone)) {
      newErrors.phone = "Le premier chiffre doit être 9, 2, 5 ou 4.";
    }

    // Validate number of players
    if (selectedChapter) {
      const { minPlayerNumber, maxPlayerNumber } = selectedChapter;
      const playerCount = Number(formData.people);

      if (isNaN(playerCount) || playerCount < minPlayerNumber || playerCount > maxPlayerNumber) {
        newErrors.people = `Le nombre de joueurs doit être entre ${minPlayerNumber} et ${maxPlayerNumber}.`;
      }
    } else {
      newErrors.people = "Veuillez sélectionner un chapitre.";
    }

    return newErrors;
  };

  // Format date for display
  const formatDate = (date) =>
    date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Format time for display
  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Format phone number for tel link
  const formatPhoneNumber = (phone) => `tel:${phone}`;

  // Handlers to dismiss messages
  const handleDismissSuccess = () => {
    setIsSuccessMessageVisible(false);
  };

  const handleDismissError = () => {
    setErrorMessage("");
  };

  return (
    <div className="reservation-container">
      <h1>Réservation</h1>
      <div className="calendar-navigation">
        <button className="nav-button" onClick={() => handleDateChange("prev")}>
          ◀
        </button>
        <div className="date-picker-container">
          <input
            type="date"
            className="date-picker"
            value={currentDate.toISOString().split("T")[0]}
            onChange={handleDateSelect}
          />
        </div>
        <button className="nav-button" onClick={() => handleDateChange("next")}>
          ▶
        </button>
      </div>

      <div className="card_rs-container">
        {chapters.map((chapter) => (
          <div className="card_r" key={chapter._id}>
            <img src={chapter.image} alt={chapter.name} className="room-image" />
            <h3>{chapter.name}</h3>
            <p>
              Joueurs: min {chapter.minPlayerNumber} - max {chapter.maxPlayerNumber || "N/A"}
            </p>
            <div className="times">
              {timeSlots[chapter._id]?.length > 0 ? (
                timeSlots[chapter._id].map((slot) => {
                  if (isToday(currentDate) && slot.isNext) {
                    return (
                      <a
                        key={slot._id}
                        href={`tel:${slot.phoneNumber || "+21625499810"}`} // Replace with your phone number or use a dynamic property
                        className="time-slot phone-slot"
                      >
                        <FaPhoneAlt className="phone-icon" /> {formatTime(slot.startTime)}
                      </a>
                    );
                  } else {
                    return (
                      <button
                        key={slot._id}
                        className={`time-slot ${slot.status}`}
                        onClick={() => handleOpenPopup(chapter, slot)}
                        disabled={slot.status !== "available"}
                      >
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </button>
                    );
                  }
                })
              ) : (
                <p className="coming-soon">Pas de créneaux disponibles</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reservation Popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 className="popup-title">
              Réservation pour {selectedChapter?.name} à {formatTime(selectedTimeSlot?.startTime)}
            </h2>
            <form className="popup-form" onSubmit={handleSubmit}>
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

              <label>Téléphone:</label>
              <div className="phone-input">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleFormChange}
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
                  placeholder="Entrez votre numéro de téléphone"
                  className={errors.phone ? "input-error" : ""}
                  required
                />
              </div>
              {errors.phone && <p className="error-message">{errors.phone}</p>}

              <label>Nombre de personnes:</label>
              <input
                type="number"
                name="people"
                value={formData.people}
                onChange={handleFormChange}
                placeholder="Nombre de participants"
                className={errors.people ? "input-error" : ""}
                min={selectedChapter?.minPlayerNumber || 1}
                max={selectedChapter?.maxPlayerNumber || 10}
                required
              />
              {errors.people && <p className="error-message">{errors.people}</p>}

              <label>Langue:</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleFormChange}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>

              <div className="popup-buttons">
                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? <ButtonLoader /> : "Confirmer"}
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
      {isSuccessMessageVisible && (
        <div className="success-message">
          <p className="success-message-text">
            Votre réservation est en cours de traitement.<br />Attendez notre confirmation.
          </p>
          <button className="ok-button" onClick={handleDismissSuccess}>
            OK
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="error-message-container">
          <p className="error-message-text">{errorMessage}</p>
          <button className="ok-button" onClick={handleDismissError}>
            OK
          </button>
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
};

export default Reservation;
