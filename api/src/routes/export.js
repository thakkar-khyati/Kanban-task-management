const express = require('express');
const { protect } = require('../middleware/auth');
const { exportBoard, exportAllBoards } = require('../controllers/exportController');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/export/boards/:id
// @desc    Export a specific board
// @access  Private
router.get('/boards/:id', exportBoard);

// @route   GET /api/export/boards
// @desc    Export all user boards
// @access  Private
router.get('/boards', exportAllBoards);

module.exports = router;
