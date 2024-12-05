import axiosInstance from "./axiosInstance";


export const getAllChapters = async () => {
  try {
    const response = await axiosInstance.get(`/chapters`);
    return response.data; // The list of chapters from the backend
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
};
export const getChapterById = async (id) => {
    try {
      const response = await axiosInstance.get(`/chapters/${id}`);
      return response.data; // The chapter object
    } catch (error) {
      console.error("Error fetching chapter by ID:", error);
      throw error;
    }
  };