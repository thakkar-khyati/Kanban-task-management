const Task = require('../models/Task');
const Board = require('../models/Board');
const { validationResult } = require('express-validator');

// @desc    Get all tasks for a board
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { boardId, status, priority, labels, assignee, search, page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Verify user has access to the board
    if (boardId) {
      const board = await Board.findOne({
        _id: boardId,
        ownerId: userId
      });

      if (!board) {
        return res.status(404).json({
          success: false,
          message: 'Board not found or access denied'
        });
      }
    }

    const query = { isArchived: false };
    if (boardId) query.boardId = boardId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = assignee;
    if (labels) {
      const labelArray = Array.isArray(labels) ? labels : labels.split(',');
      query.labels = { $in: labelArray };
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query)
      .populate('assignee', 'name email')
      .populate('comments.user', 'name email')
      .sort({ position: 1, createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      isArchived: false
    })
      .populate('assignee', 'name email')
      .populate('comments.user', 'name email')
      .populate('boardId', 'title ownerId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify user has access to the board
    if (task.boardId.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this task'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task'
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { boardId, title, description, status, priority, dueDate, labels, assignee } = req.body;
    const userId = req.user.id;

    // Verify user has access to the board
    const board = await Board.findOne({
      _id: boardId,
      ownerId: userId
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found or access denied'
      });
    }

    // Get the next position for the task
    const lastTask = await Task.findOne({ boardId, status })
      .sort({ position: -1 });
    const nextPosition = lastTask ? lastTask.position + 1 : 0;

    const taskData = {
      boardId,
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      labels: labels || [],
      assignee: assignee || null,
      position: nextPosition
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const taskId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    const task = await Task.findOne({
      _id: taskId,
      isArchived: false
    }).populate('boardId', 'ownerId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify user has access to the board
    if (task.boardId.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this task'
      });
    }

    // Update task fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        task[key] = updateData[key];
      }
    });

    await task.save();

    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findOne({
      _id: taskId,
      isArchived: false
    }).populate('boardId', 'ownerId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify user has access to the board
    if (task.boardId.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this task'
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
};

// @desc    Move task to new position/status
// @route   PUT /api/tasks/:id/move
// @access  Private
const moveTask = async (req, res) => {
  try {
    const { status, position } = req.body;
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findOne({
      _id: taskId,
      isArchived: false
    }).populate('boardId', 'ownerId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify user has access to the board
    if (task.boardId.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this task'
      });
    }

    // Update status and position
    if (status !== undefined) task.status = status;
    if (position !== undefined) task.position = position;

    await task.save();

    res.json({
      success: true,
      data: task,
      message: 'Task moved successfully'
    });
  } catch (error) {
    console.error('Move task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while moving task'
    });
  }
};

// @desc    Add subtask
// @route   POST /api/tasks/:id/subtasks
// @access  Private
const addSubtask = async (req, res) => {
  try {
    const { title } = req.body;
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findOne({
      _id: taskId,
      isArchived: false
    }).populate('boardId', 'ownerId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify user has access to the board
    if (task.boardId.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this task'
      });
    }

    await task.addSubtask(title);

    res.json({
      success: true,
      data: task,
      message: 'Subtask added successfully'
    });
  } catch (error) {
    console.error('Add subtask error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding subtask'
    });
  }
};

// @desc    Toggle subtask completion
// @route   PATCH /api/tasks/:id/subtasks/:subtaskIndex
// @access  Private
const toggleSubtask = async (req, res) => {
  try {
    const { subtaskIndex } = req.params;
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findOne({
      _id: taskId,
      isArchived: false
    }).populate('boardId', 'ownerId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify user has access to the board
    if (task.boardId.ownerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this task'
      });
    }

    await task.toggleSubtask(parseInt(subtaskIndex));

    res.json({
      success: true,
      data: task,
      message: 'Subtask toggled successfully'
    });
  } catch (error) {
    console.error('Toggle subtask error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling subtask'
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  addSubtask,
  toggleSubtask
};
