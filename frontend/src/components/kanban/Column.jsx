import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, MoreVertical } from 'lucide-react';
import Task from './Task';

const Column = ({ column, tasks, onCreateTask, onEditTask, onDeleteTask }) => {
  const getColumnColor = (columnId) => {
    const colors = {
      'todo': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
      'in-progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      'review': 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
      'done': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    };
    return colors[columnId] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  };

  return (
    <div className="kanban-column w-80 flex-shrink-0 h-full flex flex-col">
      {/* Column Header */}
      <div className="kanban-column-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {column.name}
            </h3>
            <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
              {tasks.length}
            </span>
          </div>
          
          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tasks Container */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto transition-all duration-200 ${
              snapshot.isDraggingOver
                ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-400 rounded-lg'
                : ''
            }`}
          >
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Plus className="h-8 w-8" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  No tasks yet
                </p>
                <button
                  onClick={onCreateTask}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200 hover:underline"
                >
                  Add a task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <Task
                    key={task._id}
                    task={task}
                    index={index}
                    onEdit={() => onEditTask(task)}
                    onDelete={() => onDeleteTask(task._id)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Add Task Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onCreateTask}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add a task</span>
        </button>
      </div>
    </div>
  );
};

export default Column;
