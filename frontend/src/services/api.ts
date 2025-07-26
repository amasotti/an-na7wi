import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
})

// Request interceptor for API calls
apiClient.interceptors.request.use(
  config => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
apiClient.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config

    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.status, error.response.data)

      // Handle 401 Unauthorized
      if (error.response.status === 401 && !originalRequest._retry) {
        // Handle token refresh or redirect to login
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
