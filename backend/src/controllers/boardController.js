const Board = require('../models/Board');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Get all boards for a user
// @route   GET /api/boards
// @access  Private
const getBoards = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', archived = false } = req.query;
    const userId = req.user.id;

    const query = {
      ownerId: userId,
      isArchived: archived === 'true'
    };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const boards = await Board.find(query)
      .populate('ownerId', 'name email')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Board.countDocuments(query);

    res.json({
      success: true,
      data: boards,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching boards'
    });
  }
};

// @desc    Get single board
// @route   GET /api/boards/:id
// @access  Private
const getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      ownerId: req.user.id
    }).populate('ownerId', 'name email');

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Get tasks for this board
    const tasks = await Task.getTasksByBoard(board._id);

    res.json({
      success: true,
      data: {
        ...board.toObject(),
        tasks
      }
    });
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching board'
    });
  }
};

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, columns } = req.body;
    const userId = req.user.id;

    const boardData = {
      title,
      description: description || '',
      ownerId: userId,
      columns: columns || undefined // Use default columns if not provided
    };

    const board = await Board.create(boardData);

    res.status(201).json({
      success: true,
      data: board,
      message: 'Board created successfully'
    });
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating board'
    });
  }
};

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, settings } = req.body;
    const boardId = req.params.id;
    const userId = req.user.id;

    const board = await Board.findOne({
      _id: boardId,
      ownerId: userId
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Update fields
    if (title !== undefined) board.title = title;
    if (description !== undefined) board.description = description;
    if (settings !== undefined) board.settings = { ...board.settings, ...settings };

    await board.save();

    res.json({
      success: true,
      data: board,
      message: 'Board updated successfully'
    });
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating board'
    });
  }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.id;

    const board = await Board.findOne({
      _id: boardId,
      ownerId: userId
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Delete all tasks associated with this board
    await Task.deleteMany({ boardId });

    // Delete the board
    await Board.findByIdAndDelete(boardId);

    res.json({
      success: true,
      message: 'Board and all associated tasks deleted successfully'
    });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting board'
    });
  }
};

// @desc    Archive/Unarchive board
// @route   PATCH /api/boards/:id/archive
// @access  Private
const toggleArchiveBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.id;

    const board = await Board.findOne({
      _id: boardId,
      ownerId: userId
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    board.isArchived = !board.isArchived;
    await board.save();

    res.json({
      success: true,
      data: board,
      message: `Board ${board.isArchived ? 'archived' : 'unarchived'} successfully`
    });
  } catch (error) {
    console.error('Toggle archive board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling board archive status'
    });
  }
};

// @desc    Update column order
// @route   PUT /api/boards/:id/columns
// @access  Private
const updateColumns = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { columns } = req.body;
    const boardId = req.params.id;
    const userId = req.user.id;

    const board = await Board.findOne({
      _id: boardId,
      ownerId: userId
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Update columns
    board.columns = columns;
    await board.save();

    res.json({
      success: true,
      data: board,
      message: 'Columns updated successfully'
    });
  } catch (error) {
    console.error('Update columns error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating columns'
    });
  }
};

module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  toggleArchiveBoard,
  updateColumns
};
