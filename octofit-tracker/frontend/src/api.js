/**
 * OctoFit Tracker - API Configuration
 * 
 * Provides API endpoint management with support for:
 * - GitHub Codespaces: Uses VITE_CODESPACE_NAME environment variable
 * - Localhost: Falls back to http://localhost:8000
 */

// Get base URL from Vite environment variables
const getBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  // Fallback to localhost
  return 'http://localhost:8000';
};

export const API_BASE_URL = getBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;

/**
 * Make an API request
 * @param {string} endpoint - API endpoint (e.g., '/users', '/activities')
 * @param {object} options - Fetch options
 * @returns {Promise} API response
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

/**
 * Helper functions for API calls
 */
export const api = {
  // Health check
  async health() {
    return apiCall('/health');
  },

  // Users endpoints
  users: {
    async getAll() {
      return apiCall('/users');
    },
    async getById(id) {
      return apiCall(`/users/${id}`);
    },
    async create(data) {
      return apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async update(id, data) {
      return apiCall(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    async delete(id) {
      return apiCall(`/users/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Activities endpoints
  activities: {
    async getAll() {
      return apiCall('/activities');
    },
    async getById(id) {
      return apiCall(`/activities/${id}`);
    },
    async create(data) {
      return apiCall('/activities', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async update(id, data) {
      return apiCall(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    async delete(id) {
      return apiCall(`/activities/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Teams endpoints
  teams: {
    async getAll() {
      return apiCall('/teams');
    },
    async getById(id) {
      return apiCall(`/teams/${id}`);
    },
    async create(data) {
      return apiCall('/teams', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async update(id, data) {
      return apiCall(`/teams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    async delete(id) {
      return apiCall(`/teams/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Leaderboard endpoints
  leaderboard: {
    async getGlobal(page = 1, limit = 10) {
      return apiCall(`/leaderboard?page=${page}&limit=${limit}`);
    },
    async getTeam(teamId) {
      return apiCall(`/leaderboard/team/${teamId}`);
    },
    async getUserRank(userId) {
      return apiCall(`/leaderboard/user/${userId}`);
    },
  },

  // Workouts endpoints
  workouts: {
    async getAll() {
      return apiCall('/workouts');
    },
    async getById(id) {
      return apiCall(`/workouts/${id}`);
    },
    async create(data) {
      return apiCall('/workouts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async update(id, data) {
      return apiCall(`/workouts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    async delete(id) {
      return apiCall(`/workouts/${id}`, {
        method: 'DELETE',
      });
    },
  },
};

export default api;
