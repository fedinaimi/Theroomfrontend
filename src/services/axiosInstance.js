import axios from 'axios';

// Create an Axios instance using the environment variable for the base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Use the REACT_APP_API_BASE_URL from the .env file
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to the Authorization header
  }
  return config;
});

export default axiosInstance;
