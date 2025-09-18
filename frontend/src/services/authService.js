import api from './api';

export const authService = {
  // Register new user
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      // Handle validation errors and other errors
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Network error occurred' };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      return response.data.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Login failed. Please try again.' };
    }
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw { success: false, message: 'Authentication required' };
      }
      throw { success: false, message: 'Failed to fetch user data' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to change password' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      // Even if logout fails on server, clear local storage
      localStorage.removeItem('kanban-token');
      localStorage.removeItem('kanban-user');
      throw { success: false, message: 'Logout completed' };
    }
  },

  // Get all users for selection
  getUsers: async () => {
    try {
      const response = await api.get('/auth/users');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to fetch users' };
    }
  }
};
