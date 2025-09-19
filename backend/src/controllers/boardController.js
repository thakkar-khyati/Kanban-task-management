const Board = require('../models/Board');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// @desc    Get all boards for a user
// @route   GET /api/boards
// @access  Private
const getBoards = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', archived = false } = req.query;
    const userId = req.user.id;

    const query = {
      $or: [
        { ownerId: userId },
        { 'members.user': userId }
      ],
      isArchived: archived === 'true'
    };

    // Add search functionality
    if (search) {
      query.$and = [
        query,
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete query.$or;
    }

    const boards = await Board.find(query)
      .populate('ownerId', 'name email')
      .populate('members.user', 'name email')
      .populate('taskCount')
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
    const board = await Board.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('members.user', 'name email');

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Check if user has access to this board
    // First check if user is the owner
    if (board.ownerId.toString() === req.user.id.toString()) {
      // User is the owner, they have full access
      const userRole = 'owner';
      
      // Get tasks for this board
      const tasks = await Task.getTasksByBoard(board._id);

      return res.json({
        success: true,
        data: {
          ...board.toObject(),
          tasks,
          userRole
        }
      });
    }
    
    // If not owner, check if user is a member
    const { hasAccess, role } = board.hasAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this board'
      });
    }

    // Get tasks for this board
    const tasks = await Task.getTasksByBoard(board._id);

    res.json({
      success: true,
      data: {
        ...board.toObject(),
        tasks,
        userRole: role
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

// @desc    Get board members
// @route   GET /api/boards/:id/members
// @access  Private
const getBoardMembers = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('members.user', 'name email')
      .populate('members.invitedBy', 'name email');

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Check if user has access to this board
    const { hasAccess } = board.hasAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this board'
      });
    }

    res.json({
      success: true,
      data: {
        owner: board.ownerId,
        members: board.members,
        invitations: board.invitations
      }
    });
  } catch (error) {
    console.error('Get board members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching board members'
    });
  }
};

// @desc    Invite user to board
// @route   POST /api/boards/:id/invite
// @access  Private
const inviteUser = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Check if user can invite
    if (!board.canPerformAction(req.user.id, 'invite')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to invite users'
      });
    }

    // Create invitation
    await board.createInvitation(email, role, req.user.id);

    res.json({
      success: true,
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to send invitation'
    });
  }
};

// @desc    Accept board invitation
// @route   POST /api/boards/invite/:token/accept
// @access  Private
const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const board = await Board.findOne({ 'invitations.token': token });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invitation'
      });
    }

    await board.acceptInvitation(token, req.user.id);

    res.json({
      success: true,
      message: 'Invitation accepted successfully',
      data: { boardId: board._id }
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to accept invitation'
    });
  }
};

// @desc    Decline board invitation
// @route   POST /api/boards/invite/:token/decline
// @access  Private
const declineInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const board = await Board.findOne({ 'invitations.token': token });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invitation'
      });
    }

    await board.declineInvitation(token);

    res.json({
      success: true,
      message: 'Invitation declined'
    });
  } catch (error) {
    console.error('Decline invitation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to decline invitation'
    });
  }
};

// @desc    Remove member from board
// @route   DELETE /api/boards/:id/members/:userId
// @access  Private
const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Check if user can manage members
    if (!board.canPerformAction(req.user.id, 'manage_members')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to remove members'
      });
    }

    await board.removeMember(userId);

    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to remove member'
    });
  }
};

// @desc    Update member role
// @route   PUT /api/boards/:id/members/:userId/role
// @access  Private
const updateMemberRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Check if user can manage members
    if (!board.canPerformAction(req.user.id, 'manage_members')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update member roles'
      });
    }

    await board.updateMemberRole(userId, role);

    res.json({
      success: true,
      message: 'Member role updated successfully'
    });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update member role'
    });
  }
};

// @desc    Add user directly to board
// @route   POST /api/boards/:id/add-member
// @access  Private
const addMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    const boardId = req.params.id;

    // Find the board
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

    // Check if user has permission to add members
    if (!board.canPerformAction(req.user.id, 'invite')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add members'
      });
    }

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address'
      });
    }

    // Check if user is already a member
    const existingMember = board.members.find(member => 
      member.user.toString() === user._id.toString()
    );
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this board'
      });
    }

    // Add user to board
    await board.addMember(user._id, role, req.user.id);

    // Populate the new member data
    await board.populate('members.user', 'name email');

    // Find the newly added member
    const newMember = board.members.find(member => 
      member.user._id.toString() === user._id.toString()
    );

    res.json({
      success: true,
      message: 'User added to board successfully',
      data: {
        member: newMember
      }
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add member'
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
  updateColumns,
  getBoardMembers,
  inviteUser,
  acceptInvitation,
  declineInvitation,
  removeMember,
  updateMemberRole,
  addMember
};
