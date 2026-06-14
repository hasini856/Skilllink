import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const api = {
  // ================= AUTH =================
  login: (data) => API.post("/auth/login", data).then(res => res.data),
  register: (data) => API.post("/auth/register", data).then(res => res.data),

  // ================= PROFILE =================
  getProfile: () => API.get("/profile/me").then(res => res.data),
  updateProfile: (data) => API.put("/profile/me", data).then(res => res.data),

  // ================= SKILLS =================
  getSkills: () => API.get("/skills").then(res => res.data),

  // ================= MATCHING =================
  getMatches: () => API.get("/matches").then(res => res.data),

  // ================= REQUESTS =================
  sendRequest: (data) =>
    API.post("/requests", data).then(res => res.data),

  getMyRequests: () =>
    API.get("/requests/mine").then(res => res.data),

  acceptRequest: (id) =>
    API.post(`/requests/${id}/accept`).then(res => res.data),

  rejectRequest: (id) =>
    API.post(`/requests/${id}/reject`).then(res => res.data),

  // ================= CHAT HISTORY (IMPORTANT FIX) =================
  getMessages: (roomId) =>
    API.get(`/messages/${roomId}`).then(res => res.data),

  // ================= SLOTS =================
  getAvailableSlots: () =>
    API.get("/slots/available").then(res => res.data),

  getMySlots: () =>
    API.get("/slots/mine").then(res => res.data),

  createSlot: (data) =>
    API.post("/slots", data).then(res => res.data),

  bookSlot: (slotId, data) =>
    API.post(`/slots/${slotId}/book`, data).then(res => res.data),

  // ================= SESSIONS =================
  getSessions: () =>
    API.get("/sessions/upcoming").then(res => res.data),

  getUpcomingSessions: () =>
    API.get("/sessions/upcoming").then(res => res.data),

  updateSessionReminder: (id, data) =>
    API.patch(`/sessions/${id}/reminder`, data).then(res => res.data),

  cancelSession: (id) =>
    API.patch(`/sessions/${id}/cancel`).then(res => res.data),

  // ================= ANALYTICS =================
  getAnalytics: () =>
    API.get("/analytics").then(res => res.data),

  // ================= CHATBOT =================
  sendChatMessage: (message) =>
    API.post("/ai/chat", { message }).then(res => res.data),

  // ================= QUIZ =================
  generateQuiz: (skill) =>
    API.post("/quiz", { skill }).then(res => res.data),
};