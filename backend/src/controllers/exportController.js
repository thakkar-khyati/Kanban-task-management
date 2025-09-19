const Board = require('../models/Board');
const Task = require('../models/Task');

// @desc    Export board data as JSON
// @route   GET /api/boards/:id/export
// @access  Private
const exportBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get board with all related data
    const board = await Board.findOne({
      _id: id,
      $or: [
        { ownerId: userId },
        { 'members.user': userId }
      ]
    })
      .populate('ownerId', 'name email')
      .populate('members.user', 'name email')
      .lean();

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found or access denied'
      });
    }

    // Get all tasks for the board
    const tasks = await Task.find({ boardId: id, isArchived: false })
      .populate('assignee', 'name email')
      .populate('comments.user', 'name email')
      .lean();

    // Prepare export data
    const exportData = {
      board: {
        id: board._id,
        title: board.title,
        description: board.description,
        owner: {
          id: board.ownerId._id,
          name: board.ownerId.name,
          email: board.ownerId.email
        },
        members: board.members.map(member => ({
          id: member.user._id,
          name: member.user.name,
          email: member.user.email,
          role: member.role,
          joinedAt: member.joinedAt
        })),
        columns: board.columns,
        settings: board.settings,
        isArchived: board.isArchived,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt
      },
      tasks: tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        labels: task.labels,
        assignee: task.assignee ? {
          id: task.assignee._id,
          name: task.assignee.name,
          email: task.assignee.email
        } : null,
        position: task.position,
        subtasks: task.subtasks,
        comments: task.comments.map(comment => ({
          user: {
            id: comment.user._id,
            name: comment.user.name,
            email: comment.user.email
          },
          content: comment.content,
          createdAt: comment.createdAt
        })),
        attachments: task.attachments,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      })),
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportedBy: {
          id: userId,
          name: req.user.name,
          email: req.user.email
        },
        version: '1.0.0',
        totalTasks: tasks.length,
        totalMembers: board.members.length
      }
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${board.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json"`);

    res.json(exportData);
  } catch (error) {
    console.error('Export board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting board data'
    });
  }
};

// @desc    Export all user boards as JSON
// @route   GET /api/boards/export/all
// @access  Private
const exportAllBoards = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all boards for the user
    const boards = await Board.find({
      $or: [
        { ownerId: userId },
        { 'members.user': userId }
      ],
      isArchived: false
    })
      .populate('ownerId', 'name email')
      .populate('members.user', 'name email')
      .lean();

    // Get all tasks for all boards
    const boardIds = boards.map(board => board._id);
    const tasks = await Task.find({ 
      boardId: { $in: boardIds }, 
      isArchived: false 
    })
      .populate('assignee', 'name email')
      .populate('comments.user', 'name email')
      .lean();

    // Group tasks by board
    const tasksByBoard = {};
    tasks.forEach(task => {
      if (!tasksByBoard[task.boardId]) {
        tasksByBoard[task.boardId] = [];
      }
      tasksByBoard[task.boardId].push(task);
    });

    // Prepare export data
    const exportData = {
      user: {
        id: userId,
        name: req.user.name,
        email: req.user.email
      },
      boards: boards.map(board => ({
        id: board._id,
        title: board.title,
        description: board.description,
        owner: {
          id: board.ownerId._id,
          name: board.ownerId.name,
          email: board.ownerId.email
        },
        members: board.members.map(member => ({
          id: member.user._id,
          name: member.user.name,
          email: member.user.email,
          role: member.role,
          joinedAt: member.joinedAt
        })),
        columns: board.columns,
        settings: board.settings,
        isArchived: board.isArchived,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        tasks: (tasksByBoard[board._id] || []).map(task => ({
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          labels: task.labels,
          assignee: task.assignee ? {
            id: task.assignee._id,
            name: task.assignee.name,
            email: task.assignee.email
          } : null,
          position: task.position,
          subtasks: task.subtasks,
          comments: task.comments.map(comment => ({
            user: {
              id: comment.user._id,
              name: comment.user.name,
              email: comment.user.email
            },
            content: comment.content,
            createdAt: comment.createdAt
          })),
          attachments: task.attachments,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        }))
      })),
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportedBy: {
          id: userId,
          name: req.user.name,
          email: req.user.email
        },
        version: '1.0.0',
        totalBoards: boards.length,
        totalTasks: tasks.length
      }
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="all_boards_export.json"`);

    res.json(exportData);
  } catch (error) {
    console.error('Export all boards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting all boards data'
    });
  }
};

module.exports = {
  exportBoard,
  exportAllBoards
};
