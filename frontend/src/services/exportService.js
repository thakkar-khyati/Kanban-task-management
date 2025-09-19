import api from './api';

const exportService = {
  // Export a specific board
  exportBoard: async (boardId) => {
    try {
      const response = await api.get(`/export/boards/${boardId}`, {
        responseType: 'blob'
      });
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `board_${boardId}_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Export board error:', error);
      throw new Error(error.response?.data?.message || 'Failed to export board');
    }
  },

  // Export all user boards
  exportAllBoards: async () => {
    try {
      const response = await api.get('/export/boards', {
        responseType: 'blob'
      });
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'all_boards_export.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Export all boards error:', error);
      throw new Error(error.response?.data?.message || 'Failed to export all boards');
    }
  }
};

export default exportService;
