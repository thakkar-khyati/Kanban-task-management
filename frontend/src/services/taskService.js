import api from './api';

export const taskService = {
  // Get all tasks
  getTasks: async (params = {}) => {
    try {
      const response = await api.get('/tasks', { params });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to fetch tasks' };
    }
  },

  // Get single task
  getTask: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw { success: false, message: 'Task not found' };
      }
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to fetch task' };
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to create task' };
    }
  },

  // Update task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to update task' };
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to delete task' };
    }
  },

  // Move task
  moveTask: async (id, status, position) => {
    try {
      const response = await api.put(`/tasks/${id}/move`, { status, position });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to move task' };
    }
  },

  // Add subtask
  addSubtask: async (id, title) => {
    try {
      const response = await api.post(`/tasks/${id}/subtasks`, { title });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to add subtask' };
    }
  },

  // Toggle subtask
  toggleSubtask: async (id, subtaskIndex) => {
    try {
      const response = await api.patch(`/tasks/${id}/subtasks/${subtaskIndex}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to toggle subtask' };
    }
  }
};
