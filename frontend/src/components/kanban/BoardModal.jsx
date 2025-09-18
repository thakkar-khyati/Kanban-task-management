import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Palette } from 'lucide-react';
import { boardService } from '../../services/boardService';
import toast from 'react-hot-toast';

const BoardModal = ({ board, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    columns: [
      { id: 'todo', name: 'To Do', order: 0, color: '#94a3b8' },
      { id: 'in-progress', name: 'In Progress', order: 1, color: '#3b82f6' },
      { id: 'review', name: 'Review', order: 2, color: '#f59e0b' },
      { id: 'done', name: 'Done', order: 3, color: '#10b981' }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const predefinedColors = [
    '#94a3b8', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
    '#f59e0b', '#10b981', '#06b6d4', '#84cc16', '#f97316'
  ];

  useEffect(() => {
    if (board) {
      setIsEditing(!!board._id);
      setFormData({
        title: board.title || '',
        description: board.description || '',
        columns: board.columns || [
          { id: 'todo', name: 'To Do', order: 0, color: '#94a3b8' },
          { id: 'in-progress', name: 'In Progress', order: 1, color: '#3b82f6' },
          { id: 'review', name: 'Review', order: 2, color: '#f59e0b' },
          { id: 'done', name: 'Done', order: 3, color: '#10b981' }
        ]
      });
    }
  }, [board]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...formData.columns];
    newColumns[index] = {
      ...newColumns[index],
      [field]: value
    };
    setFormData({
      ...formData,
      columns: newColumns
    });
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: `column-${Date.now()}`,
      name: 'New Column',
      order: formData.columns.length,
      color: predefinedColors[Math.floor(Math.random() * predefinedColors.length)]
    };
    setFormData({
      ...formData,
      columns: [...formData.columns, newColumn]
    });
  };

  const handleRemoveColumn = (index) => {
    if (formData.columns.length <= 1) {
      toast.error('At least one column is required');
      return;
    }
    
    const newColumns = formData.columns.filter((_, i) => i !== index);
    // Reorder columns
    newColumns.forEach((column, i) => {
      column.order = i;
    });
    setFormData({
      ...formData,
      columns: newColumns
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Board title is required');
      return;
    }

    if (formData.columns.length === 0) {
      toast.error('At least one column is required');
      return;
    }

    setIsLoading(true);

    try {
      let savedBoard;
      if (isEditing) {
        const response = await boardService.updateBoard(board._id, formData);
        savedBoard = response.data;
        toast.success('Board updated successfully');
      } else {
        const response = await boardService.createBoard(formData);
        savedBoard = response.data;
        toast.success('Board created successfully');
      }
      
      onSave(savedBoard);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save board');
      console.error('Error saving board:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    
    if (!window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      return;
    }

    try {
      await boardService.deleteBoard(board._id);
      toast.success('Board deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete board');
      console.error('Error deleting board:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Board' : 'Create New Board'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Board Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter board title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter board description (optional)"
              />
            </div>
          </div>

          {/* Columns */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Columns
              </label>
              <button
                type="button"
                onClick={handleAddColumn}
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Column
              </button>
            </div>

            <div className="space-y-3">
              {formData.columns.map((column, index) => (
                <div key={column.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white text-sm"
                      placeholder="Column name"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={column.color}
                        onChange={(e) => handleColumnChange(index, 'color', e.target.value)}
                        className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <div className="flex flex-wrap gap-1">
                        {predefinedColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleColumnChange(index, 'color', color)}
                            className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform duration-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {formData.columns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColumn(index)}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Board
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                {isLoading ? (
                  <div className="spinner w-4 h-4 mr-2"></div>
                ) : null}
                {isLoading ? 'Saving...' : (isEditing ? 'Update Board' : 'Create Board')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardModal;
