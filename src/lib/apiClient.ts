// Auto-detect: Use localhost if backend is local, otherwise use network IP
const getApiUrl = () => {
  // Check if running in development
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Try to detect if backend is accessible locally
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // For network access, use the current host's IP
  return `http://${hostname}:5000/api`;
};

const API_URL = getApiUrl();

const getToken = () => localStorage.getItem('token');

const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export default apiClient;
