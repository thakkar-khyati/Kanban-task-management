import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { ArrowLeft, Plus, MoreVertical, Settings, Archive, User } from 'lucide-react';
import { boardService } from '../services/boardService';
import { taskService } from '../services/taskService';
import Column from '../components/kanban/Column';
import TaskModal from '../components/kanban/TaskModal';
import BoardModal from '../components/kanban/BoardModal';
import BoardMembersModal from '../components/kanban/BoardMembersModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const BoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBoard();
    }
  }, [id]);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const response = await boardService.getBoard(id);
      setBoard(response.data);
      setTasks(response.data.tasks || []);
    } catch (error) {
      toast.error('Failed to fetch board');
      console.error('Error fetching board:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId;
    const newPosition = destination.index;

    // Optimistic update
    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(task => task._id === taskId);
    
    if (taskIndex === -1) return;

    const task = updatedTasks[taskIndex];
    const oldStatus = task.status;
    
    // Update task status and position
    task.status = newStatus;
    task.position = newPosition;

    // Reorder tasks in the source column
    const sourceTasks = updatedTasks.filter(t => t.status === oldStatus);
    const destTasks = updatedTasks.filter(t => t.status === newStatus);
    
    if (oldStatus === newStatus) {
      // Same column reordering
      const [removed] = sourceTasks.splice(source.index, 1);
      sourceTasks.splice(destination.index, 0, removed);
      
      // Update positions
      sourceTasks.forEach((t, index) => {
        t.position = index;
      });
    } else {
      // Different column
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);
      
      // Update positions for both columns
      sourceTasks.forEach((t, index) => {
        t.position = index;
      });
      destTasks.forEach((t, index) => {
        t.position = index;
      });
    }

    setTasks(updatedTasks);

    // Update on server
    try {
      await taskService.moveTask(taskId, newStatus, newPosition);
    } catch (error) {
      toast.error('Failed to move task');
      // Revert optimistic update
      fetchBoard();
    }
  };

  const handleCreateTask = (columnId) => {
    setSelectedTask({
      boardId: id,
      status: columnId,
      title: '',
      description: '',
      priority: 'Medium',
      labels: [],
      dueDate: null
    });
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSaved = (savedTask) => {
    if (selectedTask._id) {
      // Update existing task
      setTasks(tasks.map(task => 
        task._id === savedTask._id ? savedTask : task
      ));
    } else {
      // Add new task
      setTasks([...tasks, savedTask]);
    }
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleArchiveBoard = async () => {
    if (!window.confirm('Are you sure you want to archive this board?')) {
      return;
    }

    try {
      await boardService.toggleArchiveBoard(id);
      toast.success('Board archived successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to archive board');
    }
  };

  const handleEditBoard = () => {
    setShowBoardModal(true);
    setShowBoardMenu(false);
  };

  const handleBoardSaved = (savedBoard) => {
    setBoard(savedBoard);
    setShowBoardModal(false);
  };

  const handleBoardModalClose = () => {
    setShowBoardModal(false);
  };

  const handleManageMembers = () => {
    setShowMembersModal(true);
    setShowBoardMenu(false);
  };

  const handleMembersModalClose = () => {
    setShowMembersModal(false);
  };

  const handleMembersUpdate = () => {
    // Refresh board data when members are updated
    fetchBoard();
  };

  if (loading) {
    return <LoadingSpinner text="Loading board..." />;
  }

  if (!board) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Board not found
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {board.title}
              </h1>
              {board.description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                  {board.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Members count and add member button */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span>{board.members?.length || 1}</span>
              </div>
              <button
                onClick={handleManageMembers}
                className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                title="Manage Members"
              >
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Add Member</span>
                <span className="sm:hidden">+</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowBoardMenu(!showBoardMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {showBoardMenu && (
              <div className="absolute right-6 top-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button
                  onClick={handleEditBoard}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Board Settings
                </button>
                <button
                  onClick={handleManageMembers}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Manage Members
                </button>
                <button
                  onClick={() => {
                    setShowBoardMenu(false);
                    handleArchiveBoard();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Board
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="h-full p-2 sm:p-4 lg:p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex space-x-3 sm:space-x-4 lg:space-x-6 h-full overflow-x-auto pb-4">
              {board.columns?.map((column) => {
                const columnTasks = tasks.filter(task => task.status === column.id);
                
                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onCreateTask={() => handleCreateTask(column.id)}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          board={board}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSave={handleTaskSaved}
        />
      )}

      {showBoardModal && (
        <BoardModal
          board={board}
          onClose={handleBoardModalClose}
          onSave={handleBoardSaved}
        />
      )}

      {showMembersModal && (
        <BoardMembersModal
          board={board}
          onClose={handleMembersModalClose}
          onUpdate={handleMembersUpdate}
        />
      )}

      {/* Click outside to close board menu */}
      {showBoardMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowBoardMenu(false)}
        />
      )}
    </div>
  );
};

export default BoardPage;
