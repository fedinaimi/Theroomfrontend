// src/services/reservationService.js

import axiosInstance from "./axiosInstance";

// Fetch Chapter Details
export const fetchChapterDetails = async (chapterId) => {
  const response = await axiosInstance.get(`/chapters/${chapterId}`);
  return response.data;
};

// Fetch Time Slots for a Chapter and Date
export const fetchTimeSlots = async (chapterId, date) => {
  try {
    const response = await axiosInstance.get(`/timeSlots`, {
      params: { chapterId, date },
    });
    return response.data || [];
  } catch {
    // Ignore errors and return an empty array
    return [];
  }
};


// Create a Reservation
export const createReservation = async (reservationData) => {
  try {
    const response = await axiosInstance.post(`/reservations`, reservationData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // Pass backend error message
      throw new Error(error.response.data.message);
    }
    // Fallback for unexpected errors
    throw new Error("Une erreur s'est produite. Veuillez réessayer.");
  }
};

export const getAllChapters = async () => {
    try {
      const response = await axiosInstance.get(`/chapters`);
      return response.data; // The list of chapters from the backend
    } catch (error) {
      console.error("Error fetching chapters:", error);
      throw error;
    }
  };

  export const fetchChapters = async () => {
    const response = await axiosInstance.get("/chapters");
    return response.data;
  };
