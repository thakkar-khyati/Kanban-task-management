const express = require('express');
const router = express.Router();
const {
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

// @route   GET /api/boards/:id/members
// @desc    Get board members
// @access  Private
router.get('/:id/members', protect, validateParams.mongoId, getBoardMembers);

// @route   POST /api/boards/:id/invite
// @desc    Invite user to board
// @access  Private
router.post('/:id/invite', protect, validateParams.mongoId, inviteUser);

// @route   POST /api/boards/:id/add-member
// @desc    Add user directly to board
// @access  Private
router.post('/:id/add-member', protect, validateParams.mongoId, addMember);

// @route   POST /api/boards/invite/:token/accept
// @desc    Accept board invitation
// @access  Private
router.post('/invite/:token/accept', protect, acceptInvitation);

// @route   POST /api/boards/invite/:token/decline
// @desc    Decline board invitation
// @access  Private
router.post('/invite/:token/decline', protect, declineInvitation);

// @route   DELETE /api/boards/:id/members/:userId
// @desc    Remove member from board
// @access  Private
router.delete('/:id/members/:userId', protect, validateParams.mongoId, removeMember);

// @route   PUT /api/boards/:id/members/:userId/role
// @desc    Update member role
// @access  Private
router.put('/:id/members/:userId/role', protect, validateParams.mongoId, updateMemberRole);

module.exports = router;
