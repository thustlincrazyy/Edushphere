const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const saveToken = (token: string) => localStorage.setItem("edusphere_token", token);
export const getToken = () => localStorage.getItem("edusphere_token");
export const removeToken = () => localStorage.removeItem("edusphere_token");

export const saveUser = (user: object) => localStorage.setItem("edusphere_user", JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem("edusphere_user") || "null");

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Request failed");
  }
  return await res.json();
}

export const authAPI = {
  register: (name: string, email: string, password: string, role = "student") =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    }),

  verifyOTP: (email: string, otp: string) =>
    request("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),

  resendOTP: (email: string) =>
    request("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  login: async (email: string, password: string) => {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveToken(data.token);
    saveUser(data.user);
    return data;
  },

  logout: () => {
    removeToken();
    localStorage.removeItem("edusphere_user");
  },

  getProfile: () => request("/api/auth/profile"),
  getTeacherAnalytics: () => request("/api/auth/teacher-analytics"),
  getLeaderboard: () => request("/api/auth/leaderboard"),
  updateStats: (data: { game_score?: number }) =>
    request("/api/auth/update-stats", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  heartbeat: () => request("/api/auth/heartbeat", { method: "POST" }),
};

export const coursesAPI = {
  getAll: () => request("/api/courses/"),
  getById: (id: string) => request(`/api/courses/${id}`),
  create: (title: string, description: string, category: string) =>
    request("/api/courses/", {
      method: "POST",
      body: JSON.stringify({ title, description, category }),
    }),
  enroll: (courseId: string) =>
    request(`/api/courses/${courseId}/enroll`, { method: "POST" }),
  getMyCourses: () => request("/api/courses/my-courses"),
};

export const chatAPI = {
  sendMessage: (messages: { role: string; content: string }[], emotion?: string) =>
    request("/api/chat/message", {
      method: "POST",
      body: JSON.stringify({ messages, emotion }),
    }),
};

export const emotionAPI = {
  analyze: async (base64Image: string) => {
    // Send directly to local python backend for emotion, bypassing cloud
    const res = await fetch(`${BASE_URL}/api/emotion/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
    });
    return await res.json();
  },
  getHistory: () => request("/api/emotion/history"),
};
