// Simple direct URL - no auto-detection
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL); // Debug log

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found in localStorage');
  }
  return token;
};

const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: HeadersInit = {
      ...options.headers,
    };

    // Only add Content-Type if not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Always add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('Making request to:', `${API_URL}${endpoint}`);
    console.log('Request options:', { method: options.method || 'GET', headers });

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText || 'Request failed' };
        }
        throw new Error(error.error || error.message || 'Request failed');
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error: any) {
      console.error('API request error:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Make sure backend is running.');
      }
      throw error;
    }
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },
};

export default apiClient;
