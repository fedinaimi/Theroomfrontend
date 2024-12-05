// src/services/reservationService.js

import axiosInstance from "./axiosInstance";

// Fetch Chapter Details
export const fetchChapterDetails = async (chapterId) => {
  const response = await axiosInstance.get(`/chapters/${chapterId}`);
  return response.data;
};

// Fetch Time Slots for a Chapter and Date
export const fetchTimeSlots = async (chapterId, date) => {
  const response = await axiosInstance.get(`/timeSlots`, {
    params: { chapterId, date },
  });
  return response.data;
};

// Create a Reservation
export const createReservation = async (reservationData) => {
  const response = await axiosInstance.post(`/reservations`, reservationData);
  return response.data;
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
