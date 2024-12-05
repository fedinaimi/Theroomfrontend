import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Replace with your backend base URL

export const getAllChapters = async () => {
  try {
    const response = await axios.get(`${API_URL}/chapters`);
    return response.data; // The list of chapters from the backend
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
};
export const getChapterById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/chapters/${id}`);
      return response.data; // The chapter object
    } catch (error) {
      console.error("Error fetching chapter by ID:", error);
      throw error;
    }
  };