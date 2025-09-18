import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Tag, User, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { format, isAfter, isBefore, isToday, isTomorrow, isYesterday } from 'date-fns';
import { useState } from 'react';

const Task = ({ task, index, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'text-gray-500 bg-gray-100 dark:bg-gray-700',
      'Medium': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      'High': 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
      'Critical': 'text-red-600 bg-red-100 dark:bg-red-900/30'
    };
    return colors[priority] || colors['Medium'];
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const now = new Date();
    
    if (isToday(date)) return { text: 'Today', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' };
    if (isTomorrow(date)) return { text: 'Tomorrow', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' };
    if (isYesterday(date)) return { text: 'Yesterday', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' };
    if (isBefore(date, now)) return { text: 'Overdue', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' };
    if (isAfter(date, now)) return { text: format(date, 'MMM d'), color: 'text-gray-600 bg-gray-100 dark:bg-gray-700' };
    
    return { text: format(date, 'MMM d'), color: 'text-gray-600 bg-gray-100 dark:bg-gray-700' };
  };

  const dueDateStatus = getDueDateStatus(task.dueDate);
  const completionPercentage = task.completionPercentage || 0;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-task group relative cursor-grab active:cursor-grabbing w-full ${
            snapshot.isDragging ? 'dragging' : ''
          } priority-${task.priority.toLowerCase()}`}
        >
          {/* Task Header */}
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 flex-1 min-w-0 pr-2">
              {task.title}
            </h4>
            
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Task Description */}
          {task.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 break-words">
              {task.description}
            </p>
          )}

          {/* Task Meta */}
          <div className="space-y-2">
            {/* Priority and Due Date */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              
              {dueDateStatus && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dueDateStatus.color}`}>
                  <Calendar className="h-3 w-3 mr-1" />
                  {dueDateStatus.text}
                </span>
              )}
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.labels.slice(0, 2).map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 truncate max-w-[120px]"
                  >
                    <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </span>
                ))}
                {task.labels.length > 2 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{task.labels.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Subtasks Progress */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Subtasks</span>
                  <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {task.assignee.name}
                </span>
              </div>
            )}
          </div>

          {/* Task Menu */}
          {showMenu && (
            <div className="absolute right-0 top-0 mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}

          {/* Click outside to close menu */}
          {showMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
