import api from './api';

export const boardService = {
  // Get all boards
  getBoards: async (params = {}) => {
    try {
      const response = await api.get('/boards', { params });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to fetch boards' };
    }
  },

  // Get single board
  getBoard: async (id) => {
    try {
      const response = await api.get(`/boards/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw { success: false, message: 'Board not found' };
      }
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to fetch board' };
    }
  },

  // Create new board
  createBoard: async (boardData) => {
    try {
      const response = await api.post('/boards', boardData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to create board' };
    }
  },

  // Update board
  updateBoard: async (id, boardData) => {
    try {
      const response = await api.put(`/boards/${id}`, boardData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to update board' };
    }
  },

  // Delete board
  deleteBoard: async (id) => {
    try {
      const response = await api.delete(`/boards/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to delete board' };
    }
  },

  // Archive/unarchive board
  toggleArchiveBoard: async (id) => {
    try {
      const response = await api.patch(`/boards/${id}/archive`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to archive board' };
    }
  },

  // Update columns
  updateColumns: async (id, columns) => {
    try {
      const response = await api.put(`/boards/${id}/columns`, { columns });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to update columns' };
    }
  },

  // Get board members
  getBoardMembers: async (id) => {
    try {
      const response = await api.get(`/boards/${id}/members`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to fetch board members' };
    }
  },

  // Invite user to board
  inviteUser: async (id, email, role = 'member') => {
    try {
      const response = await api.post(`/boards/${id}/invite`, { email, role });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to send invitation' };
    }
  },

  // Accept invitation
  acceptInvitation: async (token) => {
    try {
      const response = await api.post(`/boards/invite/${token}/accept`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to accept invitation' };
    }
  },

  // Decline invitation
  declineInvitation: async (token) => {
    try {
      const response = await api.post(`/boards/invite/${token}/decline`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to decline invitation' };
    }
  },

  // Remove member
  removeMember: async (boardId, userId) => {
    try {
      const response = await api.delete(`/boards/${boardId}/members/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to remove member' };
    }
  },

  // Update member role
  updateMemberRole: async (boardId, userId, role) => {
    try {
      const response = await api.put(`/boards/${boardId}/members/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to update member role' };
    }
  },

  // Add member directly to board
  addMember: async (boardId, email, role = 'member') => {
    try {
      const response = await api.post(`/boards/${boardId}/add-member`, { email, role });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { success: false, message: 'Failed to add member' };
    }
  }
};
