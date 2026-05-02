import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// --- Student API calls ---

export const fetchStats = () => api.get("/students/stats").then((r) => r.data);

export const fetchStudents = (params = {}) =>
  api.get("/students", { params }).then((r) => r.data);

export const fetchStudentById = (id) =>
  api.get(`/students/${id}`).then((r) => r.data);

export const createStudent = (data) =>
  api.post("/students", data).then((r) => r.data);

export const updateStudent = (id, data) =>
  api.put(`/students/${id}`, data).then((r) => r.data);

export const deleteStudent = (id) =>
  api.delete(`/students/${id}`).then((r) => r.data);

export default api;
