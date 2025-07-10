import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor to check for token expiration
api.interceptors.response.use(
  response => response,
  error => {
    // Token expired or unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token/localStorage if used
      localStorage.removeItem('token');
      window.location.href = '/'; 
    }

    return Promise.reject(error);
  }
);

export default api;