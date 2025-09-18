import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Archive, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { boardService } from '../services/boardService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, [showArchived]);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await boardService.getBoards({ 
        archived: showArchived,
        limit: 50 
      });
      setBoards(response.data);
    } catch (error) {
      toast.error('Failed to fetch boards');
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      return;
    }

    try {
      await boardService.deleteBoard(boardId);
      setBoards(boards.filter(board => board._id !== boardId));
      toast.success('Board deleted successfully');
    } catch (error) {
      toast.error('Failed to delete board');
      console.error('Error deleting board:', error);
    }
  };

  const handleArchiveBoard = async (boardId) => {
    try {
      await boardService.toggleArchiveBoard(boardId);
      setBoards(boards.filter(board => board._id !== boardId));
      toast.success('Board archived successfully');
    } catch (error) {
      toast.error('Failed to archive board');
      console.error('Error archiving board:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading boards..." />;
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {showArchived ? 'Archived Boards' : 'My Boards'}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {showArchived 
                ? 'Manage your archived boards' 
                : 'Create and manage your Kanban boards'
              }
            </p>
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                showArchived
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Archive className="h-4 w-4 mr-2" />
              {showArchived ? 'Show Active' : 'Show Archived'}
            </button>
            
            {!showArchived && (
              <Link
                to="/dashboard?create=true"
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Board
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6">

        {/* Boards Grid */}
        {boards.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Plus className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {showArchived ? 'No archived boards' : 'No boards yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {showArchived 
                  ? 'You haven\'t archived any boards yet.'
                  : 'Get started by creating your first board to organize your tasks.'
                }
              </p>
              {!showArchived && (
                <Link
                  to="/dashboard?create=true"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create your first board
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {boards.map((board) => (
                <div
                  key={board._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {board.title}
                        </h3>
                        {board.description && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {board.description}
                          </p>
                        )}
                      </div>
                      
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Board stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {board.columns?.length || 0} columns
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {board.taskCount || 0} tasks
                      </span>
                    </div>

                    {/* Columns preview */}
                    <div className="flex space-x-1 mb-6">
                      {board.columns?.slice(0, 4).map((column, index) => (
                        <div
                          key={column.id}
                          className="flex-1 h-2 rounded-full"
                          style={{ backgroundColor: column.color }}
                        />
                      ))}
                      {board.columns?.length > 4 && (
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/board/${board._id}`}
                        className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Open Board
                      </Link>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleArchiveBoard(board._id)}
                          className="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          title={showArchived ? 'Unarchive board' : 'Archive board'}
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteBoard(board._id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete board"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
