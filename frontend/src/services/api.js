import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const attendanceAPI = {
    markAttendance: (data) => api.post('/attendance', data),
    getAllAttendance: () => api.get('/attendance'),
    getAttendanceByEmployee: (employeeID) => api.get(`/attendance/employee/${employeeID}`),
    getAttendanceByDate: (date) => api.get(`/attendance/date/${date}`),
    searchAttendance: (query) => api.get(`/attendance/search/${query}`),
    deleteAttendance: (id) => api.delete(`/attendance/${id}`),
    getEmployeeStats: (employeeID, year, month) => api.get(`/attendance/stats/${employeeID}/${year}/${month}`),
};

export default api;