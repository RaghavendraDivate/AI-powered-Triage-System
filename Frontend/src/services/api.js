// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Get auth token from sessionStorage (admin session only)
const getAuthToken = () => {
  return sessionStorage.getItem('admin_token');
};

// Generic API request helper with retry for transient failures and timeout handling
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add auth token if available
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    headers,
    ...options,
  };

  const MAX_RETRIES = typeof options.retries === 'number' ? options.retries : 3;
  const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
  const TIMEOUT_MS = options.timeout || 30000; // 30 seconds default
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Helper function to create timeout promise
  const createTimeoutPromise = (ms) => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), ms);
    });
  };

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(url, config),
        createTimeoutPromise(TIMEOUT_MS)
      ]);

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (jsonParseError) {
          // Response body is not JSON, ignore
        }
        const status = response.status;
        const errorMessage = errorData.detail || errorData.message || `HTTP ${status}: ${response.statusText || 'Unknown Error'}`;

        console.error(`API Error ${status} on ${endpoint}:`, errorMessage, errorData);

        // Handle specific error cases
        if (status === 429) {
          // Rate limit or quota exceeded
          if (attempt < MAX_RETRIES) {
            const delay = Math.min(2000 * 2 ** attempt, 10000);
            console.warn(`Rate limit hit (429). Retrying ${attempt + 1}/${MAX_RETRIES} in ${Math.round(delay)}ms...`);
            await sleep(delay);
            continue;
          }
          throw new Error('API rate limit exceeded. Please try again in a few moments.');
        }

        // Retry on transient server/load errors
        if (RETRY_STATUSES.has(status) && attempt < MAX_RETRIES) {
          const delay = Math.min(1000 * 2 ** attempt + Math.random() * 300, 8000);
          console.warn(`Transient error (${status}). Retrying ${attempt + 1}/${MAX_RETRIES} in ${Math.round(delay)}ms...`);
          await sleep(delay);
          continue;
        }

        if (status === 404) {
          throw new Error(`API endpoint not found: ${endpoint}. Check backend routes.`);
        }
        if (status === 400) {
          throw new Error(`${errorMessage}`);
        }
        if (status === 503) {
          throw new Error('Service temporarily unavailable. Database connection may be down. Please try again later.');
        }
        if (status === 0 || status >= 500) {
          throw new Error(`Server error occurred. Please try again later.`);
        }
        throw new Error(errorMessage);
      }

      // 204 No Content
      if (response.status === 204) return null;

      return await response.json();
    } catch (error) {
      // Handle timeout errors
      if (error.message === 'REQUEST_TIMEOUT') {
        if (attempt < MAX_RETRIES) {
          const delay = Math.min(1000 * 2 ** attempt, 5000);
          console.warn(`Request timeout. Retrying ${attempt + 1}/${MAX_RETRIES} in ${Math.round(delay)}ms...`);
          await sleep(delay);
          continue;
        }
        throw new Error('Request timed out. The server is taking too long to respond. Please check your connection and try again.');
      }

      // Network-level errors (e.g., fetch failed)
      const isNetworkError = /Failed to fetch|NetworkError|Network request failed/i.test(error.message);
      if (isNetworkError && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** attempt + Math.random() * 300, 8000);
        console.warn(`Network error. Retrying ${attempt + 1}/${MAX_RETRIES} in ${Math.round(delay)}ms...`);
        await sleep(delay);
        continue;
      }
      if (isNetworkError) {
        console.error(`Network Error: Cannot connect to server at ${API_BASE_URL}. Check backend availability and CORS.`);
        throw new Error(`Cannot connect to server. Please check your internet connection and ensure the backend is running.`);
      }
      console.error(`API Request failed [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Should not reach here
  throw new Error('Maximum retry attempts exceeded. Please try again later.');
};

// --- API Methods ---
export const hospitalAPI = {
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  predict: (symptoms, patientId = "default", conversationId = null) => {
    // Expects a clean list of symptom strings (with spaces)
    return request("/predict", {
      method: "POST",
      body: JSON.stringify({
        symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
        patient_id: patientId,
        conversation_id: conversationId,
      }),
    });
  },

  chat: (messages) => {
    // messages: array of { role: 'user'|'model', content: string }
    return request("/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    }).then(data => {
        return data.response; // Returns the raw string response
    });
  },

  book: (appointmentData) => {
    return request("/book", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  },

  getDepartments: () => request("/departments"),

  getDiseases: () => request("/diseases"),

  // Authentication
  login: (username, password) => {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      skipAuth: true  // Don't send token for login
    });
  },

  getMe: () => request("/auth/me"),

  // Appointment management
  getAppointments: (patientEmail = null) => {
    const endpoint = patientEmail ? `/appointments?patient_email=${encodeURIComponent(patientEmail)}` : "/appointments";
    return request(endpoint);
  },

  getAppointmentById: (appointmentId) => request(`/appointments/${appointmentId}`),

  updateAppointmentStatus: (appointmentId, status) => {
    return request(`/appointments/${appointmentId}?status=${status}`, {
      method: "PATCH",
    });
  },

  deleteAppointment: (appointmentId) => {
    return request(`/appointments/${appointmentId}`, {
      method: "DELETE",
    });
  },

  // Get booked slots for a specific doctor and date
  getBookedSlots: (doctorName, appointmentDate) => {
    const endpoint = `/booked-slots?doctor_name=${encodeURIComponent(doctorName)}&appointment_date=${encodeURIComponent(appointmentDate)}`;
    return request(endpoint);
  },
};

// --- Helper Functions (Keep these) ---
export const mapDepartment = (departmentName) => {
  // Simple mapping based on keywords, ensure consistency with backend/data
  const name = departmentName?.toLowerCase() || "";
  if (name.includes("pulmon")) return "pulmonology";
  if (name.includes("cardio")) return "cardiology";
  if (name.includes("neuro")) return "neurology";
  if (name.includes("gastro")) return "gastroenterology";
  if (name.includes("derma")) return "dermatology";
  if (name.includes("infectious")) return "infectious-diseases";
  if (name.includes("ortho")) return "orthopedics";
  return "general-medicine"; // Default fallback
};

export const mapDoctorLevel = (level) => {
  const levelMap = {
    senior: "senior",
    junior: "junior",
  };
  return levelMap[level?.toLowerCase()] || "junior"; // Default to junior if unknown
};

export default hospitalAPI;