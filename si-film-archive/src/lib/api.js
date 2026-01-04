const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  // Use URL object for more robust URL building
  const urlObj = new URL(endpoint, BASE_URL);
  
  // Handle query params
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });
    delete options.params;
  }
  
  const url = urlObj.toString();
  const config = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(url, config);
  
  // Handle empty response (204 No Content)
  if (response.status === 204) {
    return { success: true };
  }
  
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'Request failed',
      response.status,
      data
    );
  }

  return data;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, body, options) => request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body)
  }),
  
  patch: (endpoint, body, options) => request(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body)
  }),
  
  put: (endpoint, body, options) => request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body)
  }),
  
  delete: (endpoint, options) => request(endpoint, {
    ...options,
    method: 'DELETE'
  }),

  // For file uploads
  upload: (endpoint, formData, options = {}) => request(endpoint, {
    ...options,
    method: options.method || 'POST',
    body: formData
  })
};

// Auth specific helpers
export const authApi = {
  login: (email, password) => api.post('/api/auth/sign-in/email', { email, password }),
  register: (data) => api.post('/api/auth/sign-up/email', data),
  logout: () => api.post('/api/auth/sign-out', {}),
  getSession: () => api.get('/api/auth/session'),
  getProfile: () => api.get('/api/auth/profile'),
  
  // Google OAuth - redirect
  loginWithGoogle: () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  }
};

export { ApiError };
