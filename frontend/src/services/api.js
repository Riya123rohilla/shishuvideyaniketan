import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Event APIs
export const eventAPI = {
  getAll: () => api.get('/events'),
  getAllAdmin: () => api.get('/events/all'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  cleanupExpired: () => api.post('/events/cleanup/expired'),
};

// Enquiry APIs
export const enquiryAPI = {
  create: (data) => api.post('/enquiries', data),
  getAll: (status) => api.get('/enquiries', { params: { status } }),
  getById: (id) => api.get(`/enquiries/${id}`),
  update: (id, data) => api.put(`/enquiries/${id}`, data),
  delete: (id) => api.delete(`/enquiries/${id}`),
};

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Gallery APIs
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  create: (data) => api.post('/gallery', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Staff APIs
export const staffAPI = {
  getAll: () => api.get('/staff'),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

// Course APIs
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export default api;
