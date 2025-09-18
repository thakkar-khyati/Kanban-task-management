const express = require('express');
const router = express.Router();
const {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  toggleArchiveBoard,
  updateColumns
} = require('../controllers/boardController');
const { protect } = require('../middleware/auth');
const { validateBoard, validateParams, validateQuery } = require('../middleware/validation');

// @route   GET /api/boards
// @desc    Get all boards for user
// @access  Private
router.get('/', protect, validateQuery.pagination, getBoards);

// @route   GET /api/boards/:id
// @desc    Get single board
// @access  Private
router.get('/:id', protect, validateParams.mongoId, getBoard);

// @route   POST /api/boards
// @desc    Create new board
// @access  Private
router.post('/', protect, validateBoard.create, createBoard);

// @route   PUT /api/boards/:id
// @desc    Update board
// @access  Private
router.put('/:id', protect, validateParams.mongoId, validateBoard.update, updateBoard);

// @route   DELETE /api/boards/:id
// @desc    Delete board
// @access  Private
router.delete('/:id', protect, validateParams.mongoId, deleteBoard);

// @route   PATCH /api/boards/:id/archive
// @desc    Archive/Unarchive board
// @access  Private
router.patch('/:id/archive', protect, validateParams.mongoId, toggleArchiveBoard);

// @route   PUT /api/boards/:id/columns
// @desc    Update column order/names
// @access  Private
router.put('/:id/columns', protect, validateParams.mongoId, validateBoard.updateColumns, updateColumns);

module.exports = router;
