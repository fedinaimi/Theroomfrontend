import React, { useState, useEffect } from "react";
import {
  fetchChapters,
  fetchTimeSlots,
  createReservation,
} from "../../services/reservationService";
import "./Reservation.css";
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
    language: "en",
  });

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

    for (const chapter of chapters) {
      try {
        const chapterTimeSlots = await fetchTimeSlots(chapter._id, formattedDate);

        const now = new Date();
        const filteredSlots = chapterTimeSlots.filter((slot) => {
          const slotTime = new Date(slot.startTime);
          return date.toDateString() !== now.toDateString() || slotTime >= now;
        });

        slots[chapter._id] = filteredSlots;
      } catch (error) {
        console.error(`Error fetching slots for chapter ${chapter._id}:`, error);
        slots[chapter._id] = [];
      }
    }
    setTimeSlots(slots);
  };

  useEffect(() => {
    loadTimeSlotsForDate(currentDate);
  }, [chapters, currentDate]);

  // Navigate to next or previous day
  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));

    const today = new Date();
    if (newDate >= today.setHours(0, 0, 0, 0)) {
      setCurrentDate(newDate);
    }
  };

  // Select a specific date
  const handleDateSelect = (e) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate >= new Date().setHours(0, 0, 0, 0)) {
      setCurrentDate(selectedDate);
    }
  };

  const handleOpenPopup = (chapter, timeSlot) => {
    setSelectedChapter(chapter);
    setSelectedTimeSlot(timeSlot);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setFormData({ name: "", email: "", phone: "", countryCode: "+216", people: 1, language: "en" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

      setTimeout(() => {
        setIsSuccessMessageVisible(false);
      }, 3000);

      // Refresh time slots
      await loadTimeSlotsForDate(currentDate);
    } catch (error) {
      console.error("Error creating reservation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) =>
    date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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
            <p>Joueurs:min 3 - max {chapter.playerNumber || "N/A"}</p>
            <div className="times">
              {timeSlots[chapter._id]?.length > 0 ? (
                timeSlots[chapter._id].map((slot) => (
                  <button
                    key={slot._id}
                    className={`time-slot ${slot.isAvailable ? "" : "unavailable"}`}
                    onClick={() => handleOpenPopup(chapter, slot)}
                    disabled={!slot.isAvailable}
                  >
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </button>
                ))
              ) : (
                <p className="coming-soon"> pas de date disponible</p>
              )}
            </div>
          </div>
        ))}
      </div>

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

      {isSuccessMessageVisible && (
        <div className="success-message">
          <p className="success-message-text">
            Votre réservation est en cours de traitement.<br />Attendez notre confirmation.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reservation;
