const { body, param, query } = require('express-validator');

// User validation rules
const validateUser = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  ],
  
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('preferences.theme')
      .optional()
      .isIn(['light', 'dark', 'system'])
      .withMessage('Theme must be light, dark, or system'),
    body('preferences.language')
      .optional()
      .isLength({ min: 2, max: 5 })
      .withMessage('Language must be a valid language code')
  ],
  
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
  ]
};

// Board validation rules
const validateBoard = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Board title must be between 1 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('columns')
      .optional()
      .isArray()
      .withMessage('Columns must be an array'),
    body('columns.*.name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Column name must be between 1 and 50 characters'),
    body('columns.*.order')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Column order must be a non-negative integer'),
    body('columns.*.color')
      .optional()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('Column color must be a valid hex color')
  ],
  
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Board title must be between 1 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('settings.allowGuestAccess')
      .optional()
      .isBoolean()
      .withMessage('Allow guest access must be a boolean'),
    body('settings.allowTaskCreation')
      .optional()
      .isBoolean()
      .withMessage('Allow task creation must be a boolean'),
    body('settings.allowTaskDeletion')
      .optional()
      .isBoolean()
      .withMessage('Allow task deletion must be a boolean'),
    body('settings.allowColumnModification')
      .optional()
      .isBoolean()
      .withMessage('Allow column modification must be a boolean')
  ],
  
  updateColumns: [
    body('columns')
      .isArray({ min: 1 })
      .withMessage('Columns must be a non-empty array'),
    body('columns.*.id')
      .notEmpty()
      .withMessage('Column ID is required'),
    body('columns.*.name')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Column name must be between 1 and 50 characters'),
    body('columns.*.order')
      .isInt({ min: 0 })
      .withMessage('Column order must be a non-negative integer'),
    body('columns.*.color')
      .optional()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('Column color must be a valid hex color')
  ]
};

// Task validation rules
const validateTask = {
  create: [
    body('boardId')
      .isMongoId()
      .withMessage('Valid board ID is required'),
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Task title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('status')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Status must be between 1 and 50 characters'),
    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High', 'Critical'])
      .withMessage('Priority must be Low, Medium, High, or Critical'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('labels')
      .optional()
      .isArray()
      .withMessage('Labels must be an array'),
    body('labels.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('Each label must be between 1 and 30 characters'),
    body('assignee')
      .optional()
      .isMongoId()
      .withMessage('Assignee must be a valid user ID')
  ],
  
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Task title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('status')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Status must be between 1 and 50 characters'),
    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High', 'Critical'])
      .withMessage('Priority must be Low, Medium, High, or Critical'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('labels')
      .optional()
      .isArray()
      .withMessage('Labels must be an array'),
    body('labels.*')
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('Each label must be between 1 and 30 characters'),
    body('assignee')
      .optional()
      .isMongoId()
      .withMessage('Assignee must be a valid user ID'),
    body('position')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Position must be a non-negative integer')
  ],
  
  move: [
    body('status')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Status must be between 1 and 50 characters'),
    body('position')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Position must be a non-negative integer')
  ],
  
  addSubtask: [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Subtask title must be between 1 and 200 characters')
  ]
};

// Parameter validation rules
const validateParams = {
  mongoId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format')
  ],
  
  subtaskIndex: [
    param('subtaskIndex')
      .isInt({ min: 0 })
      .withMessage('Subtask index must be a non-negative integer')
  ]
};

// Query validation rules
const validateQuery = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],
  
  taskFilters: [
    query('boardId')
      .optional()
      .isMongoId()
      .withMessage('Board ID must be a valid MongoDB ID'),
    query('status')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Status must be between 1 and 50 characters'),
    query('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High', 'Critical'])
      .withMessage('Priority must be Low, Medium, High, or Critical'),
    query('labels')
      .optional()
      .custom((value) => {
        if (typeof value === 'string') {
          const labels = value.split(',');
          return labels.every(label => 
            typeof label === 'string' && 
            label.trim().length >= 1 && 
            label.trim().length <= 30
          );
        }
        return Array.isArray(value) && value.every(label => 
          typeof label === 'string' && 
          label.trim().length >= 1 && 
          label.trim().length <= 30
        );
      })
      .withMessage('Labels must be valid strings between 1 and 30 characters'),
    query('assignee')
      .optional()
      .isMongoId()
      .withMessage('Assignee must be a valid user ID'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search term must be between 1 and 100 characters')
  ]
};

module.exports = {
  validateUser,
  validateBoard,
  validateTask,
  validateParams,
  validateQuery
};
