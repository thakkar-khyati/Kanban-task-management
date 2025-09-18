const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Column name is required'],
    trim: true,
    maxlength: [50, 'Column name cannot exceed 50 characters']
  },
  order: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  }
}, { _id: false });

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Board title is required'],
    trim: true,
    minlength: [1, 'Board title cannot be empty'],
    maxlength: [100, 'Board title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Board owner is required']
  },
  columns: {
    type: [columnSchema],
    default: [
      { id: 'todo', name: 'To Do', order: 0, color: '#6B7280' },
      { id: 'in-progress', name: 'In Progress', order: 1, color: '#3B82F6' },
      { id: 'done', name: 'Done', order: 2, color: '#10B981' }
    ],
    validate: {
      validator: function(columns) {
        return columns.length > 0;
      },
      message: 'Board must have at least one column'
    }
  },
  settings: {
    allowGuestAccess: {
      type: Boolean,
      default: false
    },
    allowTaskCreation: {
      type: Boolean,
      default: true
    },
    allowTaskDeletion: {
      type: Boolean,
      default: true
    },
    allowColumnModification: {
      type: Boolean,
      default: true
    }
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for task count
boardSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'boardId',
  count: true
});

// Virtual for task count by column
boardSchema.virtual('taskCountByColumn', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'boardId',
  options: { 
    match: { status: { $exists: true } }
  }
});

// Index for better query performance
boardSchema.index({ ownerId: 1, isArchived: 1 });
boardSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware to ensure column order is unique
boardSchema.pre('save', function(next) {
  if (this.columns && this.columns.length > 0) {
    // Sort columns by order
    this.columns.sort((a, b) => a.order - b.order);
    
    // Ensure unique order values
    const orders = this.columns.map(col => col.order);
    const uniqueOrders = [...new Set(orders)];
    
    if (orders.length !== uniqueOrders.length) {
      // Reassign order values
      this.columns.forEach((col, index) => {
        col.order = index;
      });
    }
  }
  next();
});

// Method to add a new column
boardSchema.methods.addColumn = function(name, color = '#3B82F6') {
  const newOrder = this.columns.length;
  const newColumn = {
    id: `column-${Date.now()}`,
    name,
    order: newOrder,
    color
  };
  
  this.columns.push(newColumn);
  return this.save();
};

// Method to remove a column
boardSchema.methods.removeColumn = function(columnId) {
  this.columns = this.columns.filter(col => col.id !== columnId);
  return this.save();
};

// Method to reorder columns
boardSchema.methods.reorderColumns = function(columnIds) {
  const reorderedColumns = [];
  
  columnIds.forEach((columnId, index) => {
    const column = this.columns.find(col => col.id === columnId);
    if (column) {
      column.order = index;
      reorderedColumns.push(column);
    }
  });
  
  this.columns = reorderedColumns;
  return this.save();
};

module.exports = mongoose.model('Board', boardSchema);
