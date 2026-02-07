import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Auth
  login: (email, password) => axios.post(`${API_BASE}/auth/login`, { email, password }),
  register: (email, password, profile) => axios.post(`${API_BASE}/auth/register`, { email, password, profile }),
  
  // User
  getProfile: () => axios.get(`${API_BASE}/user/profile`),
  updateProfile: (profile) => axios.put(`${API_BASE}/user/profile`, { profile }),
  
  // Food
  estimateNutrition: (data) => {
    const formData = new FormData();
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.foodName) {
      formData.append('foodName', data.foodName);
    }
    if (data.portionSize) {
      formData.append('portionSize', data.portionSize);
    }
    return axios.post(`${API_BASE}/food/estimate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  logFood: (foodData) => axios.post(`${API_BASE}/food/log`, foodData),
  getFoodLogs: (params) => axios.get(`${API_BASE}/food/logs`, { params }),
  deleteFoodLog: (id) => axios.delete(`${API_BASE}/food/logs/${id}`),
  
  // Nutrition
  getDailyNutrition: (date) => axios.get(`${API_BASE}/nutrition/daily`, { params: { date } }),
  getAlerts: (date) => axios.get(`${API_BASE}/nutrition/alerts`, { params: { date } }),
  getWeeklyNutrition: (startDate) => axios.get(`${API_BASE}/nutrition/weekly`, { params: { startDate } }),
};


