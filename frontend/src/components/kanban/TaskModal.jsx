import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, User, Plus, Trash2 } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { boardService } from '../../services/boardService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TaskModal = ({ task, board, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    labels: [],
    assignee: ''
  });
  const [boardMembers, setBoardMembers] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setIsEditing(!!task._id);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        labels: task.labels || [],
        assignee: task.assignee || ''
      });
    }
  }, [task]);

  useEffect(() => {
    if (board?._id) {
      fetchBoardMembers();
    }
  }, [board]);

  const fetchBoardMembers = async () => {
    try {
      const response = await boardService.getBoardMembers(board._id);
      setBoardMembers(response.data.members || []);
    } catch (error) {
      console.error('Error fetching board members:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData({
        ...formData,
        labels: [...formData.labels, newLabel.trim()]
      });
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (labelToRemove) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter(label => label !== labelToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        labels: formData.labels,
        boardId: board._id,
        status: task.status || 'todo',
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      // Only include assignee if it's not empty
      if (formData.assignee && formData.assignee.trim() !== '') {
        taskData.assignee = formData.assignee;
      }

      let savedTask;
      if (isEditing) {
        const response = await taskService.updateTask(task._id, taskData);
        savedTask = response.data;
        toast.success('Task updated successfully');
      } else {
        const response = await taskService.createTask(taskData);
        savedTask = response.data;
        toast.success('Task created successfully');
      }

      onSave(savedTask);
    } catch (error) {
      toast.error(isEditing ? 'Failed to update task' : 'Failed to create task');
      console.error('Error saving task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) {
      onClose();
      return;
    }

    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.deleteTask(task._id);
      toast.success('Task deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter task description"
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assignee
            </label>
            <select
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Unassigned</option>
              {boardMembers.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Labels
            </label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLabel())}
                  className="form-input flex-1"
                  placeholder="Add a label"
                />
                <button
                  type="button"
                  onClick={handleAddLabel}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Add</span>
                </button>
              </div>
              
              {formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.labels.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-[100px] sm:max-w-[120px]">{label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLabel(label)}
                        className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-0">
            <div className="order-2 sm:order-1">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center justify-center sm:justify-start px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200 w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </button>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 order-1 sm:order-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full sm:w-auto"
              >
                {isLoading ? (
                  <div className="spinner w-4 h-4 mr-2"></div>
                ) : null}
                {isLoading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
