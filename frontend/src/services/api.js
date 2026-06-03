import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ================= TOKEN =================
API.interceptors.request.use((req) => {
  const token =
    localStorage.getItem("token");

  if (token) {
    req.headers.Authorization =
      `Bearer ${token}`;
  }

  return req;
});

export const api = {

  // ================= AUTH =================
  login: (data) =>
    API.post(
      "/auth/login",
      data
    ).then((res) => res.data),

  register: (data) =>
    API.post(
      "/auth/register",
      data
    ).then((res) => res.data),

  // ================= PROFILE =================
  getProfile: () =>
    API.get("/profile/me").then(
      (res) => res.data
    ),

  updateProfile: (data) =>
    API.put(
      "/profile/me",
      data
    ).then((res) => res.data),

  // ================= SKILLS =================
  getSkills: () =>
    API.get("/skills").then(
      (res) => res.data
    ),

  // ================= MATCHES =================
  getMatches: () =>
    API.get("/matches").then(
      (res) => res.data
    ),

  // ================= REQUESTS =================
  sendRequest: (data) =>
    API.post(
      "/requests",
      data
    ).then((res) => res.data),

  getMyRequests: () =>
    API.get(
      "/requests/mine"
    ).then((res) => res.data),

  acceptRequest: (id) =>
    API.put(
      `/requests/${id}/accept`
    ).then((res) => res.data),

  rejectRequest: (id) =>
    API.put(
      `/requests/${id}/reject`
    ).then((res) => res.data),

  // ================= SLOTS =================
  getAvailableSlots: () =>
    API.get(
      "/slots/available"
    ).then((res) => res.data),

  getMySlots: () =>
    API.get("/slots/mine").then(
      (res) => res.data
    ),

  createSlot: (data) =>
    API.post("/slots", data).then(
      (res) => res.data
    ),

  bookSlot: (slotId, data) =>
    API.post(
      `/slots/${slotId}/book`,
      data
    ).then((res) => res.data),

  // ================= SESSIONS =================
  getSessions: () =>
    API.get(
      "/sessions/upcoming"
    ).then((res) => res.data),

  getUpcomingSessions: () =>
    API.get(
      "/sessions/upcoming"
    ).then((res) => res.data),

  updateSessionReminder: (
    id,
    data
  ) =>
    API.patch(
      `/sessions/${id}/reminder`,
      data
    ).then((res) => res.data),

  cancelSession: (id) =>
    API.patch(
      `/sessions/${id}/cancel`
    ).then((res) => res.data),

  // ================= ANALYTICS =================
  getAnalytics: () =>
    API.get("/analytics").then(
      (res) => res.data
    ),

  // ================= CHAT =================
  getChats: () =>
    API.get("/chat").then(
      (res) => res.data
    ),

  sendMessage: (data) =>
    API.post("/chat", data).then(
      (res) => res.data
    ),

  // ================= AI =================
  sendChatMessage: (message) =>
    API.post("/ai/chat", {
      message,
    }).then((res) => res.data),
     // ================= AI QUIZ =================



  generateQuiz: (skill) =>



    API.post("/quiz", {



      skill,



    }).then((res) => res.data),

};