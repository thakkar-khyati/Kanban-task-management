import api from './api';

export const boardService = {
  // Get all boards
  getBoards: async (params = {}) => {
    const response = await api.get('/boards', { params });
    return response.data;
  },

  // Get single board
  getBoard: async (id) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  // Create new board
  createBoard: async (boardData) => {
    const response = await api.post('/boards', boardData);
    return response.data;
  },

  // Update board
  updateBoard: async (id, boardData) => {
    const response = await api.put(`/boards/${id}`, boardData);
    return response.data;
  },

  // Delete board
  deleteBoard: async (id) => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  },

  // Archive/unarchive board
  toggleArchiveBoard: async (id) => {
    const response = await api.patch(`/boards/${id}/archive`);
    return response.data;
  },

  // Update columns
  updateColumns: async (id, columns) => {
    const response = await api.put(`/boards/${id}/columns`, { columns });
    return response.data;
  }
};
