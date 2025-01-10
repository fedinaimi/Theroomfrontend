// src/services/priceService.js
import axiosInstance from './axiosInstance';

export const getAllPrices = async () => {
  const response = await axiosInstance.get('/prices'); // or '/api/prices'
  return response.data;
};
