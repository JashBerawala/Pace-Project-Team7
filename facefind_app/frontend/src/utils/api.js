import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
});

export const eventAPI = {
  getAll: () => API.get('/events'),
  getById: (id) => API.get(`/events/${id}`),
  getByCode: (code) => API.get(`/events/code/${code}`),
  create: (data) => API.post('/events', data),
  delete: (id) => API.delete(`/events/${id}`),
  toggle: (id) => API.patch(`/events/${id}/toggle`)
};

export const photoAPI = {
  getByEvent: (eventId) => API.get(`/photos/event/${eventId}`),
  upload: (eventId, formData, onProgress) => API.post(`/photos/upload/${eventId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    }
  }),
  delete: (photoId) => API.delete(`/photos/${photoId}`)
};

export const matchAPI = {
  findPhotos: (eventCode, formData) => API.post(`/match/${eventCode}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default API;
