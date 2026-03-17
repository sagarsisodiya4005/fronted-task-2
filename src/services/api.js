import axios from 'axios';

const API_BASE_URL = 'https://cmsback.sampaarsh.cloud';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const adminAPI = {
  getClinic: () => api.get('/admin/clinic'),
  getUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
};

export const patientAPI = {
  bookAppointment: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my'),
  getAppointmentDetails: (id) => api.get(`/appointments/${id}`),
  getMyPrescriptions: () => api.get('/prescriptions/my'),
  getMyReports: () => api.get('/reports/my'),
};

export const receptionistAPI = {
  getDailyQueue: (date) => api.get(`/queue?date=${date}`),
  updateQueueStatus: (id, status) => api.patch(`/queue/${id}`, { status }),
};

export const doctorAPI = {
  getTodayQueue: () => api.get('/doctor/queue'),
  addPrescription: (appointmentId, data) => api.post(`/prescriptions/${appointmentId}`, data),
  addReport: (appointmentId, data) => api.post(`/reports/${appointmentId}`, data),
};

export default api;
