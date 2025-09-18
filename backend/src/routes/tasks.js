const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  addSubtask,
  toggleSubtask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validateTask, validateParams, validateQuery } = require('../middleware/validation');

// @route   GET /api/tasks
// @desc    Get all tasks (with optional filters)
// @access  Private
router.get('/', protect, validateQuery.pagination, validateQuery.taskFilters, getTasks);

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', protect, validateParams.mongoId, getTask);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', protect, validateTask.create, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', protect, validateParams.mongoId, validateTask.update, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', protect, validateParams.mongoId, deleteTask);

// @route   PUT /api/tasks/:id/move
// @desc    Move task to new position/status
// @access  Private
router.put('/:id/move', protect, validateParams.mongoId, validateTask.move, moveTask);

// @route   POST /api/tasks/:id/subtasks
// @desc    Add subtask to task
// @access  Private
router.post('/:id/subtasks', protect, validateParams.mongoId, validateTask.addSubtask, addSubtask);

// @route   PATCH /api/tasks/:id/subtasks/:subtaskIndex
// @desc    Toggle subtask completion
// @access  Private
router.patch('/:id/subtasks/:subtaskIndex', protect, validateParams.mongoId, validateParams.subtaskIndex, toggleSubtask);

module.exports = router;
