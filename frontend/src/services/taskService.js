import api from './api';

export const taskService = {
  // Get all tasks
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get single task
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Move task
  moveTask: async (id, status, position) => {
    const response = await api.put(`/tasks/${id}/move`, { status, position });
    return response.data;
  },

  // Add subtask
  addSubtask: async (id, title) => {
    const response = await api.post(`/tasks/${id}/subtasks`, { title });
    return response.data;
  },

  // Toggle subtask
  toggleSubtask: async (id, subtaskIndex) => {
    const response = await api.patch(`/tasks/${id}/subtasks/${subtaskIndex}`);
    return response.data;
  }
};
